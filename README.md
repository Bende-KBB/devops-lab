# devops-lab

Learning DevOps end-to-end: from a hello world app to a deployed service, one deliberate step at a time.

- **Why and how it's built:** [docs/pipeline.md](docs/pipeline.md)
- **All documentation:** [docs/README.md](docs/README.md)
- **Set up a machine:** [docs/how-to/setup.md](docs/how-to/setup.md)

## Run with Docker Compose

Requires a Docker Engine with the Compose plugin. Node.js is not needed on the host.

```bash
docker compose up -d --build     # build the image and start the app in the background
curl -i http://localhost:8080    # test
docker compose down              # stop and remove
```

Expected: `200 OK`, `Content-Type: text/plain; charset=utf-8`, body `Hello world`.

Port mapping: host port `8080` → container port `3000`. Configuration: [compose.yaml](compose.yaml).

## Public URL

`docker compose up -d` also starts a Cloudflare quick tunnel (the `tunnel` service), which gives the app a temporary public HTTPS URL. Find it with:

```bash
docker compose logs tunnel       # look for https://<random>.trycloudflare.com
```

The URL changes on every start. How the tunnel works and its risks: [phase 2](docs/phases/phase-2-public-url/README.md), [step 4 of phase 3](docs/phases/phase-3-container/4-tunnel-container.md). Only this hello world server may be exposed this way.

## Current limitations

- The image is built by hand and exists only on this machine.
- The image runs as root.
- Base image updates are manual: security patches arrive only when the pinned digest is updated.
- Offline when the laptop sleeps or a container crashes, and nobody notices.
- The public URL is random, changes on every start, and must be looked up in the logs.
- Mistakes such as a typo are only discovered when a request arrives.
