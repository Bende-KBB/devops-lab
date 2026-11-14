# Docker Cheat Sheet

Commands, this project's files line by line, and common errors. Concepts: [explanation/docker.md](../explanation/docker.md). Installation: [how-to/setup.md](../how-to/setup.md).

## This project

```bash
docker compose up -d             # build (always, from source) and start in the background
docker compose ps                # list this project's containers
docker compose logs app          # what the app printed
docker compose logs tunnel       # includes the public https://...trycloudflare.com URL
curl -i http://localhost:8080    # test
docker compose down              # stop and remove containers and network
```

## Project files

The files explain themselves in their comments: [Dockerfile](../../Dockerfile), [compose.yaml](../../compose.yaml).

## Updating the base image

The base image is pinned by digest, so updates never happen by themselves.

```bash
docker pull node:24-slim                                                  # newest image of the major version
docker run --rm node:24-slim node -v                                      # which Node.js version it contains
docker image inspect --format '{{index .RepoDigests 0}}' node:24-slim     # its digest
docker image inspect --format '{{.Created}}' node:24-slim                 # when it was built
```

1. **New Node.js version?** Wait 14 days after its release, unless it's a **security release** (check the Node.js release notes): then adopt directly and document it. **Same version, new build** (operating system patches only)? Adopt directly.
2. Write `node:<version>-slim@<digest>` in **both** places: the `FROM` line of the `Dockerfile`, and the `smoke-test` service's `image:` in `compose.yaml`.
3. `docker compose up -d`, then `curl -i http://localhost:8080` and `docker compose exec app node -v`.

## Docker Compose

| Command | What it does |
|---|---|
| `docker compose up -d` | Create and start all services in the background (`-d` = detached) |
| `docker compose up --wait` | Start in the background; return only once every service is healthy (or running, if it has no health check) |
| `docker compose run --rm <service>` | Run a one-off container for a service (dependencies first), return its exit code, and delete it afterwards (`--rm`) |
| `docker compose up -d --build` | Force a rebuild. Not needed in this project: `pull_policy: build` always rebuilds |
| `docker compose ps` | List this project's containers |
| `docker compose logs <service>` | Show a service's output (`-f` to follow) |
| `docker compose exec <service> <command>` | Run a command inside a running service |
| `docker compose down` | Stop and remove containers and the project network (images stay) |

## Images

| Command | What it does |
|---|---|
| `docker build -t <name> .` | Build an image from `./Dockerfile`. `.` is the **build context**: the only files `COPY` can use |
| `docker image ls` | List stored images. *Disk usage* = unpacked on this machine; *content size* = compressed, as downloaded |
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
| `exec: "ps": executable file not found` | The slim image has no such tool | Expected; inspect from the host (`docker compose ps`, `docker compose logs`) |
| Tunnel URL gives 502 Bad Gateway | Tunnel can't reach the app | Check `http://app:3000` (service name, **container** port) and that `app` is Up |
| `container ... is unhealthy` | The health check keeps failing | `docker compose logs app`; `docker inspect --format '{{json .State.Health}}' devops-lab-app-1` shows the last check results |
| `dependency failed to start: container ... is unhealthy` | The app's health check failed, so the test never started | `docker compose logs app` |
