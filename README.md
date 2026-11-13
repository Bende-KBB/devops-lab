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
docker compose down              # stop and remove (takes ~10 s, see limitations)
```

Expected: `200 OK`, `Content-Type: text/plain; charset=utf-8`, body `Hello world`.

Port mapping: host port `8080` → container port `3000`. Configuration: [compose.yaml](compose.yaml).

## Run publicly

Exposes the container on a temporary public HTTPS URL through a Cloudflare quick tunnel. How it works and its risks: [phase 2](docs/phases/phase-2-public-url/README.md).

1. Start the container (terminal 1):
   ```bash
   docker compose up -d
   ```
2. Start the tunnel (terminal 2):

   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```

3. Open the `https://<random>.trycloudflare.com` URL it prints.

Only this hello world server may be exposed this way.

## Current limitations

- The image is built by hand and exists only on this machine.
- The image is ~1 GB, runs as root, and uses a movable base tag (`node:24`).
- The container ignores stop signals: every stop waits 10 seconds, then the process is killed.
- Two processes in two terminals must stay running; every step is manual.
- Offline when the laptop sleeps, a terminal closes, or the server crashes, and nobody notices.
- The public URL is random and changes on every tunnel restart.
- Mistakes such as a typo are only discovered when a request arrives.
