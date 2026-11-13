# Docker Cheat Sheet

Commands, this project's files line by line, and common errors. Concepts: [explanation/docker.md](../explanation/docker.md). Installation: [how-to/setup.md](../how-to/setup.md).

## This project

```bash
docker compose up -d --build     # build the image and start in the background
docker compose ps                # list this project's containers
docker compose logs app          # what the app printed
docker compose logs tunnel       # includes the public https://...trycloudflare.com URL
curl -i http://localhost:8080    # test
docker compose down              # stop and remove containers and network
```

## Project files, line by line

### Dockerfile

```dockerfile
FROM node:24
COPY server.js .
CMD ["node", "server.js"]
```

| Line | Meaning |
|---|---|
| `FROM node:24` | Start from the official Node.js 24 image (Debian + Node.js) |
| `COPY server.js .` | Copy `server.js` from the build context into the image's current folder (`/`, since none is set) |
| `CMD ["node", "server.js"]` | The command a container runs when it starts |

### compose.yaml

```yaml
services:
  app:
    build: .
    init: true
    ports:
      - "8080:3000"

  tunnel:
    image: cloudflare/cloudflared@sha256:<digest>
    command: ["tunnel", "--url", "http://app:3000"]
    depends_on:
      - app
```

| Line | Meaning |
|---|---|
| `services:` | The containers this project runs |
| `app:` | Service name; also its address on the project network |
| `build: .` | Build from `./Dockerfile`; the image is named `devops-lab-app` |
| `init: true` | Run `docker-init` as process 1, which forwards stop signals; stops take ~1 s instead of 10 |
| `"8080:3000"` | Host port 8080 → container port 3000 (quoted: YAML-safe) |
| `tunnel:` | Second service: Cloudflare's `cloudflared` image |
| `image: ...@sha256:...` | Pinned by digest (version 2026.10.1) |
| `command:` | Arguments for the image's built-in `cloudflared` program |
| `http://app:3000` | The app by service name and container port, on the project network |
| `depends_on:` | Start `app` first |

## Docker Compose

| Command | What it does |
|---|---|
| `docker compose up -d` | Create and start all services in the background (`-d` = detached) |
| `docker compose up -d --build` | Same, rebuilding images first |
| `docker compose ps` | List this project's containers |
| `docker compose logs <service>` | Show a service's output (`-f` to follow) |
| `docker compose exec <service> <command>` | Run a command inside a running service |
| `docker compose down` | Stop and remove containers and the project network (images stay) |

## Images

| Command | What it does |
|---|---|
| `docker build -t <name> .` | Build an image from `./Dockerfile`. `.` is the **build context**: the only files `COPY` can use |
| `docker image ls` | List stored images and sizes |
| `docker pull <image>` | Download an image without running it |
| `docker image inspect <image>` | Metadata: digest, user, entrypoint, command |
| `docker image inspect --format '{{index .RepoDigests 0}}' <image>` | Print the image's digest, for pinning |
| `docker image rm <image>` | Delete an image |

## Containers (without Compose)

| Command | What it does |
|---|---|
| `docker run <image>` | Create and start a container |
| `--rm` | Delete the container when it stops |
| `--name <name>` | Fixed name (otherwise random) |
| `-p <host>:<container>` | Publish a port |
| `-it` | Interactive terminal |
| `-v <host-path>:<container-path>` | Mount a host folder |
| `--init` | Run an init process as PID 1 (same as `init: true`) |
| `docker ps` / `docker ps -a` | List running / all containers |
| `docker logs <container>` | Show a container's output |
| `docker exec <container> <command>` | Run a command inside a running container |
| `docker stop <container>` | Send `SIGTERM`; after 10 s, `SIGKILL` |
| `docker rm <container>` | Delete a stopped container |

## Engine and cleanup

| Command | What it does |
|---|---|
| `docker version` | Client and engine versions; proves they can talk |
| `docker compose version` | Compose plugin version |
| `systemctl is-active docker` | Is the engine running? |
| `docker system df` | Disk used by images, containers, cache |
| `docker system prune` | Delete stopped containers, unused networks, dangling images (asks first) |

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `permission denied ... /var/run/docker.sock` | User not in the `docker` group, or the session predates joining | `sudo usermod -aG docker $USER`, then restart the distro |
| `Cannot connect to the Docker daemon` | Engine not running | `sudo systemctl start docker` |
| `docker: 'compose' is not a docker command` | Compose plugin missing | `sudo apt install -y docker-compose-v2` |
| `curl: (7) ... Connection refused` | Wrong port, or not published | Use `localhost:8080`; check `ports:` in `compose.yaml` |
| `port is already allocated` | Something else uses host port 8080 | `docker ps`; stop it, or change the host side of the mapping |
| Stop takes 10 s | No init process | `init: true` in `compose.yaml` |
| Tunnel URL gives 502 Bad Gateway | Tunnel can't reach the app | Check `http://app:3000` (service name, **container** port) and that `app` is Up |
