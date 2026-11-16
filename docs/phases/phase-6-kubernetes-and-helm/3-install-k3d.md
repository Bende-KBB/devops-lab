# Step 3: Install k3d

[← Phase 6](README.md)

## Problem

- **No local cluster:** Kubernetes needs a cluster, and there's no tool on the machine to create one.

## Change

- **k3d v5.9.0** installed to `/usr/local/bin/k3d`, from the official GitHub release, checksum verified.

## What k3d is

- **A tool that creates Kubernetes clusters inside Docker:** each node of the cluster is a Docker container running **k3s**, a lightweight Kubernetes.
- **Disposable:** `k3d cluster delete` removes the node containers, and nothing else on the machine changes.
- **Default Kubernetes version** of this k3d release: k3s `v1.35.5-k3s1`.

## Decisions

| Decision | Why |
|---|---|
| k3d (not kind or minikube) | The lightest; uses the existing Docker Engine; k3s is also used on small servers |
| Release binary, checksum verified (not the install script) | Nothing runs before it's verified |
| `/usr/local/bin` | The standard place for programs installed by hand; `apt` never touches it |

## Before and after

| | Before | After |
|---|---|---|
| Create a local cluster | Not possible | `k3d cluster create` |

## Limitations

- **Updates are manual:** a new k3d version means repeating the download and verification.
- **No cluster exists yet.**

## Verify

```bash
which k3d       # /usr/local/bin/k3d
k3d version     # k3d version v5.9.0
```