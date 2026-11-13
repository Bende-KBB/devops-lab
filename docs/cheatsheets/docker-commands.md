# Docker Commands

Commands used in this project, this project's Dockerfile, and common errors. Concepts: [explanation/docker.md](../explanation/docker.md). Installation: [how-to/setup.md](../how-to/setup.md).

## This project

```bash
docker compose up -d --build     # build and start in the background
docker compose ps                # list this project's containers
docker compose logs app          # what the app printed
curl -i http://localhost:8080    # test
docker compose down              # stop and remove containers and network
```

## Docker Compose

Compose reads `compose.yaml` and creates the containers it describes. It's a plugin for the `docker` command (Ubuntu package: `docker-compose-v2`), using the same engine. It runs on one machine only.

| Command | What it does |
|---|---|
| `docker compose up -d` | Create and start all services in the background (`-d` = detached) |
| `docker compose up -d --build` | Same, rebuilding images first |
| `docker compose ps` | List this project's containers |
| `docker compose logs <service>` | Show a service's output |
| `docker compose down` | Stop and remove containers and the project network (images stay) |

```yaml
services:
  app:            # service name; also its name on the Compose network
    build: .      # build from ./Dockerfile (image: devops-lab-app)
    ports:
      - "8080:3000"   # host port 8080 → container port 3000 (quoted: YAML-safe)
```

## The Dockerfile, line by line

```dockerfile
FROM node:24
COPY server.js .
CMD ["node", "server.js"]
```

| Line | Meaning |
|---|---|
| `FROM node:24` | Start from the official Node.js 24 image (Debian + Node.js). Everything in it becomes the base of our image. |
| `COPY server.js .` | Copy `server.js` from the build context into the image's current folder (`/`, since none is set). |
| `CMD ["node", "server.js"]` | The command a container runs when it starts. |

## Images

| Command | What it does |
|---|---|
| `docker build -t <name> .` | Build an image from the `Dockerfile` in the current folder. `.` is the **build context**: the only files `COPY` can use. |
| `docker image ls` | List stored images and their sizes |
| `docker pull <image>` | Download an image without running it |
| `docker image rm <image>` | Delete an image |
| `docker image inspect <image>` | Show an image's metadata (digest, user, command, layers) |

## Containers

| Command | What it does |
|---|---|
| `docker run <image>` | Create and start a container |
| `--rm` | Delete the container when it stops |
| `--name <name>` | Give it a fixed name (otherwise a random one) |
| `-p <host>:<container>` | Publish a port: host port → container port |
| `-it` | Interactive terminal (`-i` input open, `-t` terminal) |
| `-v <host-path>:<container-path>` | Mount a host folder into the container |
| `--init` | Run a tiny init process as PID 1, so stop signals work |
| `docker ps` / `docker ps -a` | List running / all containers |
| `docker stop <container>` | Send `SIGTERM`; after 10 s, `SIGKILL` |
| `docker logs <container>` | Show what the container printed |
| `docker exec <container> <command>` | Run a command inside a running container |
| `docker exec -it <container> bash` | Open a shell inside a running container (if the image has bash) |
| `docker rm <container>` | Delete a stopped container |

## Engine and cleanup

| Command | What it does |
|---|---|
| `docker version` | Client and engine versions; proves they can talk |
| `docker info` | Engine details: storage, containers, images |
| `systemctl is-active docker` | Is the engine service running? |
| `docker system df` | How much disk images and containers use |
| `docker system prune` | Delete stopped containers, unused networks, dangling images (asks first) |

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `permission denied ... /var/run/docker.sock` | User is not in the `docker` group, or the session predates joining it | `sudo usermod -aG docker $USER`, then restart the distro |
| `Cannot connect to the Docker daemon` | The engine isn't running | `sudo systemctl start docker` |
| `curl: (7) Failed to connect ... Connection refused` | Port not published | Add `-p 3000:3000` |
| `port is already allocated` | Another container or process uses host port 3000 | `docker ps`, stop it, or use another host port (`-p 3001:3000`) |
| `Conflict. The container name "/devops-lab" is already in use` | A stopped container with that name still exists | `docker rm devops-lab`, or run with `--rm` |
| Ctrl+C does nothing | The app is PID 1 and doesn't handle signals | `docker stop <name>` from another terminal, or run with `--init` |
