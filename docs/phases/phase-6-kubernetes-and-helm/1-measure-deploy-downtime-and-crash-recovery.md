# Step 1: Measure Deploy Downtime and Crash Recovery

[← Phase 6](README.md)

## Problem

- **The problems were assumed, not measured:** "every deploy causes downtime" and "a crash stays down" came from reasoning about Compose.
- **A fix needs a "before":** the same measurement, repeated later, shows whether a change helped.

## Change

- **Production updated** to the latest published image, through a PR (new digest in `compose.production.yaml`).
- **A measurement loop** against `https://devops-pipe.live`, about twice per second:

```bash
while true; do printf '%s ' "$(date +%T)"; curl -s -o /dev/null -w '%{http_code}\n' --max-time 2 https://devops-pipe.live; sleep 0.5; done
```

| Part | Meaning |
|---|---|
| `date +%T` | Current time, to measure how long a gap lasts |
| `-o /dev/null -w '%{http_code}\n'` | Discard the body; print only the status code |
| `--max-time 2` | Give up after 2 s; a request without an answer prints `000` |

- **Deploy:** `up -d --wait --force-recreate --no-deps app`: stop the old container, create and start a new one, the sequence of every deploy.
- **Crash:** `docker kill devops-lab-app-1`: `SIGKILL`, no graceful shutdown.

## Results

| Event | Failed requests | Status codes | Duration | Ended by |
|---|---|---|---|---|
| Deploy | 0 | — | Shorter than the loop's interval | — |
| Crash | 8 | `000`, `502` | ~16 s | A person running `up` |

- **`000`:** no answer within 2 s; Cloudflare was waiting for the dead app.
- **`502`:** Cloudflare gave up: the tunnel is up, nothing answers behind it.

## Interpretation

- **Deploy:** a gap exists (the old container stops before the new one starts), but this app shuts down and starts in milliseconds, so the gap falls between two requests. It grows with the time an app needs to start.
- **Crash:** the outage has no end until someone acts.
- **Compose alone:** `restart: unless-stopped` would restart crashed containers; nothing in Compose removes the deploy gap.

## Limitations

- **A crashed app stays down** until someone restarts it.
- **Every deploy stops the old container before the new one starts.**
- **The measurement samples about every 0.6 s:** shorter gaps aren't visible.

## Verify

```bash
docker compose -f compose.yaml -f compose.production.yaml up -d --wait
# second terminal: the loop above
docker compose -f compose.yaml -f compose.production.yaml up -d --wait --force-recreate --no-deps app
docker kill devops-lab-app-1
docker compose -f compose.yaml -f compose.production.yaml up -d --wait
docker compose -f compose.yaml -f compose.production.yaml down
```