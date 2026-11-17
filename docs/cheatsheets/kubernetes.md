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
```

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `Failed to create cluster ... already exists` | A cluster with that name exists | `k3d cluster list`; start it, or delete it first |
| `The connection to the server ... was refused` | The cluster is stopped | `k3d cluster start devops-lab` |
| `ErrImagePull`, `ImagePullBackOff` | The node can't download the image | `kubectl describe pod <name>`, Events section; the kubelet keeps retrying on its own |