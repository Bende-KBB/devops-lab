# devops-lab

Learning DevOps end-to-end: from a hello world app to a deployed service, one deliberate step at a time.

- **Why and how it's built:** [docs/pipeline.md](docs/pipeline.md)
- **All documentation:** [docs/README.md](docs/README.md)
- **Set up a machine:** [docs/how-to/setup.md](docs/how-to/setup.md)

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

- **First-time setup:** `k3d cluster create --config infra/local-cluster.yaml`, then `kubectl create secret generic tunnel-token --from-env-file=tunnel.env`, then `kubectl apply -f kubernetes/`.
- **Fallback:** `compose.production.yaml` still runs the app and the tunnel with Compose (both files on every command).

## Current limitations

- The image is built by hand and exists only on this machine.
- Base image updates are manual: security patches arrive only when the pinned digest is updated.
- Offline when the laptop sleeps or a container crashes, and nobody notices.
- Production runs on the laptop: the domain serves the app only while the containers run.
- Deploying means typing commands on the production machine.
- Every deploy causes a short downtime.
- Mistakes such as a typo are only discovered when a request arrives.
