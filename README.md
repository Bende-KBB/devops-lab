# devops-lab

Learning DevOps end-to-end: from a hello world app to a deployed service, one deliberate step at a time.

- **Why and how it's built:** [docs/pipeline.md](docs/pipeline.md)
- **All documentation:** [docs/README.md](docs/README.md)
- **How work is done here (people and AI agents):** [AGENTS.md](AGENTS.md)
- **Set up a machine:** [docs/how-to/set-up-the-development-machine.md](docs/how-to/set-up-the-development-machine.md)

## Run with Docker Compose

Requires a Docker Engine with the Compose plugin. Node.js is not needed on the host.

```bash
docker compose up -d             # build the image (always, from source) and start the app in the background
curl -i http://localhost:8080    # test
docker compose down              # stop and remove
```

Expected: `200 OK`, `Content-Type: text/plain; charset=utf-8`, body `Hello world`.

Port mapping: host port `8080` → container port `3000`. Configuration: [compose.yaml](compose.yaml).

## Test

```bash
docker compose run --rm smoke-test   # starts the app if needed, then runs the tests in tests/
docker compose down
```

The same test runs in CI on every pull request.

## Production

**https://devops-pipe.live**: served from the local Kubernetes cluster, while it runs.

```bash
k3d cluster start devops-lab
kubectl get pods                    # app and tunnel pods Running
curl -i https://devops-pipe.live
k3d cluster stop devops-lab         # takes the site offline
```

Start, stop, deploy, first-time setup, and the Compose fallback: [run production](docs/how-to/run-production.md).

## Current limitations

- **Production runs on this laptop:** the domain serves the app only while the distro and the cluster run.
- **Deploying means typing commands:** a new version is a digest change in `charts/devops-lab/values.yaml`, then `helm upgrade` by hand.
- **Deleting a pod can fail single requests:** a shutdown race between leaving the Service and stopping.
- **Updates are manual:** base images, pinned actions, and the deployed digest.
- **Settings live outside Git:** GitHub and Cloudflare are configured in their web interfaces.

Ranked, with evidence: [Phase 6 result](docs/phases/phase-6-kubernetes-and-helm/result.md).
