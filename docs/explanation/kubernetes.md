# Kubernetes, Explained

What Kubernetes is made of, built up one concept at a time. Commands: [cheatsheets/kubernetes.md](../cheatsheets/kubernetes.md).

## 1. The cluster

A **cluster** is a set of machines (**nodes**) plus a **control plane** that decides what runs where, and keeps it that way.

```mermaid
flowchart TB
    subgraph CP["Control plane"]
        API["API server<br/>the only entrance"]
        DB["Datastore<br/>the declared state"]
        CTRL["Controllers<br/>compare declared vs actual, fix differences"]
        SCH["Scheduler<br/>picks a node for each workload"]
    end
    subgraph N["Node"]
        KL["kubelet<br/>starts and watches containers"]
    end
    API --> KL
```

- **Declared state:** you tell the API server *what* should run; the controllers make it so, and keep it so.
- **Nodes** run the workloads; the **kubelet** on each node is the local worker.
- **Even empty,** a cluster runs: the control plane waits for instructions, and Kubernetes runs a few helpers of its own (cluster DNS, resource metrics, storage).

## 2. A cluster is not an image

| | Image | Container | Cluster |
|---|---|---|---|
| Created from | `Dockerfile` | An image | A blueprint (here `infra/local-cluster.yaml`) |
| Changes over time | Never | Its writable layer | Yes: everything deployed into it |
| Stop / start | — | `docker stop` / `start` | `k3d cluster stop` / `start` |
| Delete | `docker image rm` | `docker rm` | `k3d cluster delete`: everything inside is gone |

- **Stopped:** the nodes don't run; no CPU, no memory; everything inside is kept.
- **Deleted:** the nodes and everything inside are gone; the blueprint can build an empty one again.

## 3. This project's cluster

- **k3s:** a lightweight Kubernetes distribution.
- **k3d:** runs k3s with each node as a Docker container.
- **Blueprint:** [`infra/local-cluster.yaml`](../../infra/local-cluster.yaml), in the repo.
- **Credentials:** `~/.kube/config`, written by k3d, never in the repo. Whoever has it controls the cluster.

## 4. `kubectl` and the kubeconfig

- **`kubectl`** is the command-line client for the API server: it turns commands into HTTPS requests, and the answers into tables.
- **The kubeconfig** (`~/.kube/config`) tells it where the API server is, and holds the credential it presents. The API server answers only clients that prove who they are.
- **Contexts:** the file can describe several clusters; the **current context** selects which one `kubectl` talks to.

## 5. Server and agent nodes

- **Server nodes** run the control plane (and, in k3s, workloads too).
- **Agent nodes** run workloads only. Their kubelet joins the cluster with the API server's address and a **join token**, and from then on reports its state and takes work.
- **`kubectl` never talks to nodes:** it talks to the API server, which hands work to the kubelets. One `kubectl` controls 3 nodes or 3,000 the same way.
- **In production,** each node is its own machine: self-managed servers or virtual machines, or a cloud provider's managed cluster, where the provider runs the control plane and the team rents worker machines.
- **This project:** three real nodes, sharing one machine.

## 6. Pods and manifests

- **A pod** is the smallest thing Kubernetes runs: one container (sometimes a few tightly coupled ones) with its own IP address in the cluster. It runs on one node, and it's disposable: a deleted pod is gone.
- **A manifest** is a file describing an object's desired state:

```yaml
apiVersion: v1      # which part of the Kubernetes API
kind: Pod           # what kind of object
metadata:
  name: app         # its name
spec:               # its desired state
  containers: ...
```

- **`kubectl apply -f <file>`** hands the manifest to the API server. The scheduler picks a node; that node's kubelet pulls the image and starts the container.

## 7. Deployments, ReplicaSets, and labels

```mermaid
flowchart TB
    D["Deployment<br/>replicas + pod template"] --> RS["ReplicaSet<br/>keeps the count"]
    RS --> P1["pod"]
    RS --> P2["pod"]
```

- **Deployment:** "keep N copies of this pod running." It creates a ReplicaSet; on updates, it replaces it with a new one.
- **ReplicaSet:** counts its pods and creates or removes pods until the count matches.
- **Labels** are key-value tags on objects (`app.kubernetes.io/name: devops-lab`). A **selector** picks objects by label: that's how a Deployment knows which pods are its own.
- **Namespaces:** objects live in a namespace, a named group within the cluster. Without one specified, they go to `default`.