# Step 1: Graceful Shutdown

[← Phase 5](README.md)

## Problem

- **The app ignores stop signals when it's process 1:** without an `init` process, every stop waits for the platform's timeout, then the app is killed.
- **Kubernetes has no `init` option:** it stops containers on every update, every move, every scale-down, always with `SIGTERM`, then a kill after 30 seconds.
- **A killed app cuts off open requests.**

## Change

`server.js` handles the stop signals itself:

````js
const SHUTDOWN_TIMEOUT_MS = 5000; // exit anyway if requests don't finish in time

function shutDown(signal) {
  console.log(`Received ${signal}, shutting down`);

  server.close(() => {
    console.log("All connections closed, exiting");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Shutdown timed out, exiting");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
````

`compose.yaml`: `init: true` removed.

## How it works

````mermaid
sequenceDiagram
    participant P as Platform<br/>(Docker, Kubernetes)
    participant A as App (node server.js)
    participant C as Client mid-request

    P->>A: SIGTERM ("please stop")
    A->>A: stop accepting new connections
    C->>A: request already in progress
    A-->>C: response, completed normally
    A->>A: all connections finished
    A-->>P: exit code 0
    Note over P,A: if the app is still running after the grace period:<br/>SIGKILL, immediate, nothing finishes
````

- **`server.close()`:** stops new connections; its callback runs once the open ones are finished. Idle keep-alive connections are closed too (Node.js 19 and later).
- **Exit code 0:** a clean stop. Exit code 1 only if the safety net fires.
- **The safety net (5 s):** shorter than Docker's grace period (10 s) and Kubernetes's (30 s), so the app always exits before it would be killed.

## Decisions

| Decision | Why |
|---|---|
| Handle `SIGTERM` and `SIGINT` | `SIGTERM` is what platforms send; `SIGINT` is Ctrl+C in a terminal |
| Remove `init: true` from Compose | Test what you run: Kubernetes has no `init`, so Compose shouldn't hide a broken handler |
| 5-second safety net | Well inside every platform's grace period |
| Log the reason for stopping | Shows in `docker compose logs app` why the app ended |

## The analogy

See [analogy](../../explanation/analogy.md). The cook now hears "closing time!" himself, finishes the bowls already ordered, and closes the window. The doorman who used to pass the message on is no longer needed.

## Before and after

| | Before | After |
|---|---|---|
| Stop without `init` | ≈ 10 s, then killed | ≈ 1 s, clean exit |
| Open requests on stop | Cut off | Completed |
| `init: true` in Compose | Required | Removed |
| Logs on stop | Nothing | `Received SIGTERM, shutting down` |

## Limitations

- **A crashed app still stays down:** nothing restarts it.
- **The safety-net timeout is fixed in the code:** changing it means changing the app.

## Verify

````bash
docker compose up -d --wait
time docker compose stop app     # ≈ 1 s
docker compose logs app          # Received SIGTERM, shutting down / All connections closed, exiting
docker compose down
````