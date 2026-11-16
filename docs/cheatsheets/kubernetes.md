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
kubectl version                  # kubectl's and the cluster's versions
```

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `Failed to create cluster ... already exists` | A cluster with that name exists | `k3d cluster list`; start it, or delete it first |
| `The connection to the server ... was refused` | The cluster is stopped | `k3d cluster start devops-lab` |