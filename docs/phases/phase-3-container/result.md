# Phase 3: Result

[← Phase 3](README.md)

## Progress

Every problem found in the naive setup, and what happened to it.

```mermaid
flowchart LR
    N["Naive setup"] --> A["✔ Long docker run commands<br/>step 2: compose.yaml"]
    N --> B["✔ 10 s forced stop<br/>step 3: init: true"]
    N --> C["✔ Second terminal,<br/>cloudflared runs as the user<br/>step 4: tunnel container"]
    N --> D["✔ ~1.6 GB image<br/>step 5: node:24-slim"]
    N --> E["✔ Runs as root<br/>step 7: USER node"]
    N --> F["✔ Movable base tag<br/>step 6: pinned by digest"]
    N --> G["✘ App copied into /<br/>(accepted)"]
```

| Problem | Status | Fixed by |
|---|---|---|
| App needs Node.js on the host | ✔ Fixed | Step 1: image |
| Server can see the user's files and keys | ✔ Fixed | Step 1: container isolation |
| Settings live in long commands | ✔ Fixed | Step 2: `compose.yaml` |
| Every stop waits 10 s, then kills | ✔ Fixed | Step 3: `init: true` |
| Tunnel needs a second terminal and runs as the user | ✔ Fixed | Step 4: `tunnel` service, non-root, pinned by digest |
| ~1.6 GB image | ✔ Fixed | Step 5: `node:24-slim`, 330 MB |
| Runs as root | ✔ Fixed | Step 7: `USER node` (UID 1000) |
| Movable base tag | ✔ Fixed | Step 6: `node:24.22.3-slim@sha256:...` |
| App copied into `/` | ✘ Accepted | Cosmetic; no security or size impact |

## New limitations introduced by this phase

| Limitation | Why it matters |
|---|---|
| Docker Engine runs as root; the `docker` group is root-equivalent | Anyone in the group controls the whole distro |
| Containers share the host's kernel | Weaker isolation than a virtual machine |
| Compose runs on one machine only | No spreading load, no moving containers between machines |
| The public URL appears only in the tunnel's logs | Looked up with `docker compose logs tunnel` after every start. Accepted: a stable address removes it |
| No debugging tools inside the app container | `ps` and similar are missing since step 5. Intended for production images |
| Base image updates are manual | Since step 6, security patches arrive only when someone updates the digest. Automation (Dependabot, Renovate) is out of scope |
| Container user ID 1000 matches the host user's ID | An escaped process would have that user's rights (not root's). A unique high ID is a possible refinement |

## Limitations carried into the next phase

- The image is built by hand and exists only on this laptop → **Phase 4: CI**.
- A crashed container stays down → **Phase 5: Kubernetes**.
