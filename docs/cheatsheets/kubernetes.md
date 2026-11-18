# Kubernetes Cheat Sheet

Commands for the local cluster. Concepts: [explanation/kubernetes.md](../explanation/kubernetes.md).

## The cluster (k3d)

The blueprint: [`infra/local-cluster.yaml`](../../infra/local-cluster.yaml).

```bash
k3d cluster create --config infra/local-cluster.yaml   # build it from the blueprint
k3d cluster list                                       # servers 1/1 = running, 0/1 = stopped
k3d cluster stop devops-lab                            # stop: keeps everything inside
k3d cluster start devops-lab                           # start again
k3d cluster delete devops-lab                          # delete: everything inside is gone
```

## Look around

```bash
kubectl config current-context                                  # which cluster kubectl talks to
kubectl version                                                 # kubectl's and the cluster's versions
kubectl get nodes                                               # nodes and their status
kubectl get pods -o wide                                        # pods, with their node and IP
kubectl get pods --watch                                        # keep listing changes (Ctrl+C to stop)
kubectl get pods -l app.kubernetes.io/name=tunnel               # only pods with this label
kubectl get deployment,replicaset,pods -o wide                  # several kinds at once
kubectl get service app                                         # the Service's fixed IP and port
kubectl get endpointslices -l kubernetes.io/service-name=app    # the pods the Service currently targets
docker stats --no-stream                                        # memory and CPU of each node container
```

## Investigate

```bash
kubectl describe pod <pod>                                      # details and events of one pod
kubectl logs <pod>                                              # what a pod's container printed
kubectl logs -f <pod>                                           # follow it live
kubectl logs deployment/tunnel | grep "Registered tunnel connection"   # connectors online
kubectl exec deployment/app -- <command>                        # run a command inside one of the pods
kubectl port-forward service/app 8081:3000                      # local 8081 → the Service's port 3000
kubectl run measure --image=<image> --restart=Never --command -- <command>   # a one-off pod
```

## Change

The app is a Helm release (below). The tunnel and its Secret are managed with kubectl:

```bash
kubectl create secret generic tunnel-token --from-env-file=tunnel.env   # the tunnel token, from the local file
kubectl get secret tunnel-token                                          # its size only, never the value
kubectl apply -f kubernetes/tunnel-deployment.yaml                       # the tunnel connectors
kubectl rollout restart deployment/tunnel                                # restart them (after a token change)
kubectl rollout status deployment/app                                    # follow an update until it's finished
kubectl get replicasets                                                  # one per pod template; old ones at 0
kubectl delete pod <pod>                                                 # remove a pod; its Deployment replaces it
```

**Never run `kubectl get secret tunnel-token -o yaml`:** it prints the token, only base64-encoded.

## Helm: the app's release

```bash
helm template devops-lab charts/devops-lab                    # render without applying
helm upgrade --install devops-lab charts/devops-lab           # install or upgrade the release
helm upgrade devops-lab charts/devops-lab --set replicas=3    # override one value
helm list                                                     # installed releases
helm history devops-lab                                       # revisions
helm rollback devops-lab <revision>                           # restore a revision (adds a new one)
helm version
```

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `Failed to create cluster ... already exists` | A cluster with that name exists | `k3d cluster list`; start it, or delete it first |
| `The connection to the server ... was refused` | The cluster is stopped | `k3d cluster start devops-lab` |
| `ErrImagePull`, `ImagePullBackOff` | The node can't download the image | `kubectl describe pod <name>`, Events section; the kubelet keeps retrying on its own |
| `READY 0/1`, `STATUS Running`, for a few seconds | The readiness probe hasn't succeeded yet (the app is starting) | Normal; check `kubectl describe pod <name>` if it lasts |
| Pods `Unknown`, `Pending`, `RESTARTS` climbing right after `k3d cluster start` | The cluster is waking up: kubelets reconnecting, containers restarted | Wait until `kubectl get pods --watch` stays stable |
| Cloudflare error 1033 / `530` on `devops-pipe.live` | No connector is running: the cluster is stopped | `k3d cluster start devops-lab` |
| `UPGRADE FAILED: conflict ... with "kubectl-client-side-apply"` | A field was last written by `kubectl`; Helm won't overwrite it | Once: `helm upgrade ... --force-conflicts`; then manage the app only with Helm |