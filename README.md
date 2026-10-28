# devops-lab

Learning DevOps end-to-end: from a hello world app to a deployed, monitored service, one deliberate step at a time.

## Run locally

Requires Node.js 24.

```bash
node server.js
```

The server listens on port 3000. Test it from a second terminal:

```bash
curl -i http://localhost:3000
```

Expected: status `200 OK`, `Content-Type: text/plain; charset=utf-8`, body `Hello world`.

Stop the server with Ctrl+C. After changing `server.js`, restart it: Node reads the file only at startup.

## Run publicly (walking skeleton)

Exposes the local server on a temporary public HTTPS URL through a Cloudflare quick tunnel. No account and no router configuration needed. How it works and its risks: [spike DL-9](docs/spikes/DL-9-quick-tunnel.md).

Requires `cloudflared` 2026.10.1, installed from the official GitHub release `.deb` with its SHA-256 checksum verified.

1. Start the server (terminal 1):

   ```bash
   node server.js
   ```

2. Start the tunnel (terminal 2):

   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. Open the `https://<random>.trycloudflare.com` URL printed by `cloudflared`.

Stop both with Ctrl+C. Only this hello world server may be exposed this way.

## Current limitations

- Runs from the source folder, on a machine with Node.js installed.
- Two processes in two terminals must stay running; every step is manual.
- Offline when the laptop sleeps, a terminal closes, or the server crashes, and nobody notices.
- The public URL is random and changes on every tunnel restart.
- Quick tunnels are meant for testing: no uptime guarantee.
- Mistakes such as a typo in a method name are only discovered when a request arrives.
- The port is hard-coded.