# Phase 6: Kubernetes and Helm

**Status:** in progress

## The problems this phase solves

From the [Phase 5 result](../phase-5-production/result.md), ranked:

- **Every deploy causes downtime:** Compose stops the old container before starting the new one.
- **A crashed app stays down:** nothing restarts it.

## The tools

- **Kubernetes:** runs containers on a group of machines (a cluster) and keeps them in a declared state. Starts new versions before stopping old ones (rolling updates); replaces crashed containers (self-healing).
- **Helm:** packages the app's Kubernetes configuration as a reusable, parameterized chart.

## Expected trade-offs

| Gain | Cost |
|---|---|
| Deploys without downtime | Many new concepts |
| Crashed containers restarted automatically | A cluster using laptop memory |
| Declared state in files | More configuration files |

## Steps

| Step | Problem | Change | Status |
|---|---|---|---|
| [1. Measure deploy downtime and crash recovery](1-measure-deploy-downtime-and-crash-recovery.md) | The problems are assumed, not measured | Baseline measurement | Done |
| [2. Model a realistic startup time](2-model-a-realistic-startup-time.md) | The app doesn't start like a real service | Declared, simulated 5-second startup | Done |
| 3+. The app in a cluster | Deploy downtime; crashes stay down | Cluster, Helm chart, rolling updates, readiness probes | Planned |