# Lessons Learned

Every backtrack in this project: what happened, what the right choice would have been, and where the evidence is. This is a **living** document, and the outline for a future clean guide that follows the right path from the start, without the detours.

The phases stay as they happened; this page is where hindsight goes.

## Backtracks

| # | What happened | The right choice | Evidence |
|---|---|---|---|
| 1 | Started with TypeScript, npm, and a pinned Node.js toolchain; restarted as one plain JavaScript file | Start with the smallest deliverable; add tooling when a problem needs it | Archived repository `devops-lab-v1` |
| 2 | Experiments ran as separate "spikes" in phases 1–3, then were dropped | Keep experiments inside the step docs, as measured tests | [Phase 1](phases/phase-1-local-server/README.md) |
| 3 | A random quick-tunnel URL for three phases before a domain existed | Register the domain early: it takes days (nameservers, offers) and every later phase uses it | [Phase 5, step 2](phases/phase-5-production/2-serve-the-app-on-stable-domain.md) |
| 4 | Slow stops fixed with `init: true`; later replaced by graceful shutdown in the app | Handle `SIGTERM` in the app from the first container | [Phase 3, step 3](phases/phase-3-container/3-init.md), [Phase 5, step 1](phases/phase-5-production/1-graceful-shutdown.md) |
| 5 | The tunnel lived in the development `compose.yaml`; later moved to a production file | Separate development and production configuration before the first public deploy | [Phase 5, step 3](phases/phase-5-production/3-production-runs-the-tested-image.md) |
| 6 | A "tunnel behind a profile" step was built and dropped | Ask what the everyday command should do before adding switches | Jira: the step's ticket, marked Won't Do |
| 7 | Publishing was first designed as a skipped job in `ci.yml`; then a separate `publish.yml`, renamed to `publish-image.yml` | One workflow per trigger; names that state the purpose; protect `main` before the first release | [Phase 4](phases/phase-4-continuous-integration/README.md), steps 5–8 |
| 8 | Phase 5 was planned as "Kubernetes" and re-planned mid-phase as "Production on the domain" | Plan phases from the user-facing goal, and measure problems before choosing a tool | [Phase 5](phases/phase-5-production/README.md) |
| 9 | Deploy downtime was assumed, then measured as zero for a millisecond-start app | Measure first; model realistic behavior openly when the app is too small to show it | [Phase 6, steps 1–2](phases/phase-6-kubernetes-and-helm/1-measure-deploy-downtime-and-crash-recovery.md) |
| 10 | The Service used port 80, then 3000 to match the tunnel route | Keep a service's port the same everywhere unless a reason exists | [Phase 6, step 12](phases/phase-6-kubernetes-and-helm/12-serve-production-traffic-from-the-cluster.md) |
| 11 | Objects created with `kubectl`, then adopted by Helm (a field-ownership conflict) | If Helm will manage an app, create its objects with Helm from the start | [Phase 6, step 14](phases/phase-6-kubernetes-and-helm/14-package-the-app-as-a-chart.md) |
| 12 | The tunnel stayed outside the chart | Package everything a release needs, except Secrets, in one chart | [Phase 6, step 14](phases/phase-6-kubernetes-and-helm/14-package-the-app-as-a-chart.md) |
| 13 | `docker compose config` printed the tunnel token | Check configuration with `config --images`; never print resolved configuration | [Phase 5, step 3](phases/phase-5-production/3-production-runs-the-tested-image.md) |
| 14 | A stray host `cloudflared` interfered with a later setup | Remove host tools once they run in containers | [Development machine setup](how-to/set-up-the-development-machine.md), step 8 (now optional) |
| 15 | A managed network blocked `ghcr.io` during experiments | Know the network's limits before demos; pull images in advance | [Run production](how-to/run-production.md) |
| 16 | Docs pointed forward to phases that were later renumbered | History docs name limitations; only later docs point back | [Docs index](README.md) |
| 17 | Running 24/7 was cut for the class deadline, then restored | Record scope changes with their reason; scope is a decision too | [Pipeline](pipeline.md) |

## Adding an entry

When a later step reverses or corrects an earlier one, add a row here in the same PR: what happened, the right choice, and links to the steps involved.
