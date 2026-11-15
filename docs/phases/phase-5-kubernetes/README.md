# Phase 5: Kubernetes

**Status:** in progress

## The problems this phase solves

From the [Phase 4 result](../phase-4-continuous-integration/result.md), ranked:

- **A crashed app stays down:** nothing restarts it, and nobody notices.
- **Nothing runs the published image:** the app runs from a local build, started by hand.
- **No graceful shutdown:** the app only stops correctly when started with an `init` process.

## The tool: Kubernetes

- **What it is:** a system that runs containers on a group of machines (a **cluster**) and keeps them in the state you declare: "this image, this many copies, reachable like this."
- **Self-healing:** it continuously compares the declared state with what's actually running, and corrects differences. A crashed container is replaced without anyone acting.
- **Why this tool:** the industry standard for running containers. Everything after this phase (Helm, Argo CD, running 24/7) builds on it.
- **Locally:** a small cluster on the laptop, inside Docker.

## The analogy

See [analogy](../../explanation/analogy.md), Phase 5: the fleet manager who keeps the ordered number of trucks serving.

## Expected trade-offs

| Gain | Cost |
|---|---|
| Crashed containers are restarted automatically | Many new concepts for one small app |
| Runs the published image, by digest | A cluster to install and run, using laptop resources |
| Declared state in files, reviewed like code | More configuration files |

## Steps

| Step | Problem | Change | Status |
|---|---|---|---|
| [1. Graceful shutdown](1-graceful-shutdown.md) | The app only stops correctly with an `init` process | `server.js` handles `SIGTERM`/`SIGINT`; `init` removed from Compose | Done |
| 2. A local cluster | No cluster to run