# Phase 5: Production on the Domain

**Status:** in progress

## The problems this phase solves

From the [Phase 4 result](../phase-4-continuous-integration/result.md):

- **No graceful shutdown:** the app only stops correctly when started with an `init` process.
- **The public address is random:** it changes on every start; it can't be shared or relied on.
- **Production runs a local build:** `docker compose up` builds from the files on disk, not the image CI tested and published.

## The tools

No new tools: a **named tunnel** in the existing Cloudflare account, and **Compose** configuration.

## Expected trade-offs

| Gain | Cost |
|---|---|
| A stable address on the own domain | The first real secret (the tunnel token) must be protected |
| Production runs only tested images | Routing settings live in the Cloudflare dashboard, not in Git |
| | Production still runs on the laptop: online only while it runs |

## Steps

| Step | Problem | Change | Status |
|---|---|---|---|
| [1. Graceful shutdown](1-graceful-shutdown.md) | The app only stops correctly with an `init` process | `server.js` handles `SIGTERM`/`SIGINT`; `init` removed from Compose | Done |
| [2. Serve the app on stable domain](2-serve-the-app-on-stable-domain.md) | The public address is random | Named tunnel → `devops-pipe.live` | Done |
| 3. Production runs the tested image | Production runs a local build | The GHCR image, by digest | Planned |