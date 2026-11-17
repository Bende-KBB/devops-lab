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

## kubectl

```bash
kubectl config current-context   # which cluster kubectl talks to
kubectl get nodes                # the cluster's nodes and their status
docker stats --no-stream         # memory and CPU of each node container
kubectl version                  # kubectl's and the cluster's versions
kubectl apply -f kubernetes/app-pod.yaml   # create or update what the file describes
kubectl get pods -o wide                   # pods, with their node and IP
kubectl get pods --watch                   # keep listing changes (Ctrl+C to stop)
kubectl describe pod app                   # details and events of one pod
kubectl logs app                           # what the pod's container printed
kubectl port-forward pod/app 8081:3000     # local port 8081 → the pod's port 3000
kubectl delete pod app                     # remove a pod
kubectl apply -f kubernetes/app-deployment.yaml    # the Deployment
kubectl get deployment,replicaset,pods -o wide     # several kinds at once
kubectl port-forward deployment/app 8081:3000      # one of the Deployment's pods
kubectl apply -f kubernetes/app-service.yaml                      # the Service
kubectl get service app                                           # its fixed IP and port
kubectl get endpointslices -l kubernetes.io/service-name=app      # the pods it currently targets
kubectl exec deployment/app -- <command>                          # run a command inside one of the pods
kubectl port-forward service/app 8081:80                          # local 8081 → the Service's port 80
kubectl rollout status deployment/app                    # follow an update until it's finished
kubectl get replicasets                                  # one per pod template; old ones at 0
kubectl run measure --image=<image> --restart=Never --command -- <command>   # a one-off pod
kubectl logs -f measure                                  # follow a pod's output live
kubectl create secret generic tunnel-token --from-env-file=tunnel.env   # the tunnel token, from the local file
kubectl get secret tunnel-token                                          # its size only, never the value
kubectl get pods -l app.kubernetes.io/name=tunnel                        # only pods with this label
kubectl logs deployment/tunnel | grep "Registered tunnel connection"     # connectors online
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