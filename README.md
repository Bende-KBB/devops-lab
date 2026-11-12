# devops-lab

Learning DevOps end-to-end: from a hello world app to a deployed service, one deliberate step at a time.

- **Why and how it's built:** [docs/pipeline.md](docs/pipeline.md)
- **All documentation:** [docs/README.md](docs/README.md)
- **Set up a machine:** [docs/how-to/setup.md](docs/how-to/setup.md)

## Run with Docker

Requires a Docker Engine. Node.js is not needed on the host.

```bash
docker build -t devops-lab .
docker run --rm --name devops-lab -p 3000:3000 devops-lab
```

Test from a second terminal:

```bash
curl -i http://localhost:3000
```

Expected: `200 OK`, `Content-Type: text/plain; charset=utf-8`, body `Hello world`.

Stop it from a second terminal (Ctrl+C does not stop it, see limitations):

```bash
docker stop devops-lab
```

## Run publicly

Exposes the container on a temporary public HTTPS URL through a Cloudflare quick tunnel. How it works and its risks: [phase 2](docs/phases/phase-2-public-url/README.md).

1. Start the container (terminal 1), as above.
2. Start the tunnel (terminal 2):

   ```bash
   cloudflared tunnel --url http://localhost:3000
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
