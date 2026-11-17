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
| [3. Install k3d](3-install-k3d.md) | No tool to create a local cluster | k3d, verified | Done |
| [4. Create a minimal cluster](4-create-a-minimal-cluster.md) | No cluster | One node, from a config file | Done |
| [5. Look into the cluster](5-look-into-the-cluster.md) | No way to see inside | `kubectl`; list the nodes | Done |
| [6. Add agent nodes](6-add-agent-nodes.md) | Only one node | Two agents | Done |
| [7. Run the app as a pod](7-run-the-app-as-a-pod.md) | Nothing of ours runs in the cluster | One pod, from a manifest | Done |
| [8. Keep pods running](8-keep-pods-running.md) | A deleted pod stays deleted | Deployment, 2 replicas | Done |
| [9. Reach the app at a stable address inside the cluster](9-reach-the-app-at-a-stable-address-inside-the-cluster.md) | Pods have changing addresses | Service `app` | Done |
| [10. Send traffic only to ready pods](10-send-traffic-only-to-ready-pods.md) | Kubernetes doesn't know when a pod is ready | Readiness and liveness probes | Done |
| 11. Measure a rolling update | Deploy downtime | Rolling update, measured | Planned |
| 12. Production traffic through the cluster | Traffic still goes to Compose | Tunnel in the cluster | Planned |
| 13. One source of values | The Kubernetes files repeat values | Helm chart | Planned |