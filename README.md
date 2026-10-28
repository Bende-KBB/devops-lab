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

## Current limitations

- Every step is manual: the folder, the command, the port.
- Mistakes such as a typo in a method name are only discovered when a request arrives, and they crash the server.
- The port is hard-coded.