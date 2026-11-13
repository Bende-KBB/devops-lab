# Development Machine Setup

**Applies to:** Windows 10/11 with WSL2.
**Result:** an isolated Linux environment (`devops-lab`) with Git, GitHub SSH access, its own Docker Engine, cloudflared, this repository, and VS Code connected to it.

Every step ends with a **Check**. Don't continue until it passes.

| Placeholder | Replace with |
|---|---|
| `<github-username>` | Your GitHub username |
| `<noreply-email>` | Your GitHub noreply address (**GitHub → Settings → Emails**, format `12345678+username@users.noreply.github.com`) |
| `<linux-user>` | The Linux username created in Step 1 |
| `<windows-user>` | Your Windows username (folder name under `C:\Users\`) |

## The big picture

```
Windows
├── Windows Terminal   (profile "devops-lab")
├── VS Code            (UI on Windows)
└── WSL2
    ├── <other distros>   ← other work; untouched
    ├── docker-desktop    ← only if Docker Desktop is installed; never used here
    └── devops-lab        ← this project (Ubuntu 26.04 LTS)
        ├── Git + own SSH key → GitHub
        ├── Docker Engine (own, isolated)
        ├── cloudflared
        └── ~/devops-lab (the repository)
```

**Why Linux:** Docker, Kubernetes, and CI runners are Linux-native. **Why a dedicated distro:** other distros may hold other Git identities, credentials, and clusters; a separate distro keeps a command for this project from hitting them. It isolates configuration, not security: code running inside can still reach Windows files.

---

## 1. Create the distro (PowerShell)

```powershell
wsl --install -d Ubuntu-26.04 --name devops-lab
```

Create a Linux username and password when asked. **Store the password in a password manager.** If `--name` is rejected, run `wsl --update` first.

**Check:** `wsl --list --verbose` shows `devops-lab` with `VERSION 2`. Leave the default distro (`*`) unchanged.

> Forgotten Linux password: `wsl -d devops-lab -u root`, then `passwd <linux-user>`, then `exit`.

## 2. Always open in the Linux home folder (Windows Terminal)

Work under `~`, never under `/mnt/c`: files crossing the Windows/Linux boundary are slow and their permissions unreliable.

Terminal → **Ctrl + ,** → **Profiles → devops-lab** (or **Add a new profile → New empty profile**) → **Command line**:

```
wsl.exe -d devops-lab --cd ~
```

**Check:** opening the profile gives a prompt ending in `~$`.

## 3. Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

## 4. Hide Windows programs from the distro

WSL adds the Windows `PATH` to Linux by default. That made Docker Desktop's `docker` client visible here, which would silently use Docker Desktop's shared engine. Turn it off, then add back only VS Code.

```bash
sudo cp /etc/wsl.conf /etc/wsl.conf.bak
printf '\n[interop]\nappendWindowsPath = false\n' | sudo tee -a /etc/wsl.conf
echo 'export PATH="$PATH:/mnt/c/Users/<windows-user>/AppData/Local/Programs/Microsoft VS Code/bin"' >> ~/.bashrc
```

Restart the distro (PowerShell): `wsl --terminate devops-lab`, then reopen it.

**Check:** `which code` prints the VS Code path; `which docker` prints nothing (until Step 7).

## 5. Configure Git

Commits in a public repository show the author's email. Use the noreply address.

```bash
git config --global user.name "<github-username>"
git config --global user.email "<noreply-email>"
git config --global init.defaultBranch main
git config --global pull.ff only
git config --global fetch.prune true
git config --global core.editor "code --wait"
```

| Setting | Effect |
|---|---|
| `pull.ff only` | `git pull` refuses to create a merge if histories diverged |
| `fetch.prune true` | Fetching removes references to branches deleted on GitHub |
| `core.editor "code --wait"` | Git opens VS Code for messages and waits for the tab to close |

**Check:** `git config --global --list`

## 6. SSH key for GitHub

The private key never leaves this machine; GitHub gets the public key. This distro gets its own key, so it can be revoked alone.

```bash
ssh-keygen -t ed25519 -C "<noreply-email>"     # accept the path, set a passphrase
cat ~/.ssh/id_ed25519.pub                      # copy this line
```

GitHub → **Settings → SSH and GPG keys → New SSH key** → paste.

Remember the passphrase per session with an agent (the key file stays encrypted):

```bash
sudo apt install -y keychain
echo 'eval "$(keychain --eval --quiet --noask id_ed25519)"' >> ~/.bashrc
printf 'Host github.com\n  AddKeysToAgent yes\n' >> ~/.ssh/config
```

**Check:** `ssh -T git@github.com`. On first connect, compare the fingerprint with GitHub's published one (ED25519: `SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU`) before typing `yes`. Expected: `Hi <github-username>!`

## 7. Docker Engine (this distro only)

Docker Desktop's engine would be shared with every integrated distro. This distro gets its own, from Ubuntu's package.

1. In **Docker Desktop → Settings → Resources → WSL integration**, keep `devops-lab` **off** (if Docker Desktop is installed).
2. Install:

```bash
sudo apt install -y docker.io docker-buildx docker-compose-v2
sudo usermod -aG docker $USER
```

`docker-compose-v2` is the Compose plugin: it adds the `docker compose` command, using the same engine.

`usermod -aG docker` adds the user to the `docker` group so `docker` works without `sudo`. **This is root-equivalent**: anyone in the group can start a container that mounts the whole filesystem. Accepted only because this distro is dedicated to the project.

Restart the distro (PowerShell): `wsl --terminate devops-lab`, then reopen it.

**Check:**

```bash
systemctl is-active docker     # active
docker version                 # shows Client AND Server
docker compose version         # Docker Compose version v2.x
docker run --rm hello-world    # "Hello from Docker!"
```

## 8. cloudflared (exact version, verified)

Download one specific release instead of adding a third-party package repository, so updates happen only when chosen.

1. On `https://github.com/cloudflare/cloudflared/releases`, pick a release **at least 14 days old**; note its version and the SHA256 of `cloudflared-linux-amd64.deb` from the release notes.
2. Download, verify, install:

```bash
cd /tmp
curl -fLO https://github.com/cloudflare/cloudflared/releases/download/<version>/cloudflared-linux-amd64.deb
sha256sum cloudflared-linux-amd64.deb     # must equal the published checksum
sudo apt install ./cloudflared-linux-amd64.deb
```

**Check:** `cloudflared --version`

## 9. Clone the repository and connect VS Code

```bash
cd ~
git clone git@github.com:<github-username>/devops-lab.git
cd devops-lab
code .
```

Install VS Code's **WSL** extension on Windows if asked.

**Check:** VS Code's bottom-left corner shows **WSL: devops-lab**.

## 10. Optional: Node.js on the host

Only needed to run `node server.js` without Docker. Install nvm from a **pinned commit** (tags can be moved; commits can't): on `https://github.com/nvm-sh/nvm`, open a release at least 14 days old, take its full commit SHA, then:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/<full-commit-sha>/install.sh | bash
# open a new terminal
nvm install 24.22.1
```

**Check:** `node -v` prints `v24.22.1`.

---

## Final check

```bash
cd ~/devops-lab
docker compose up -d --build
curl -i http://localhost:8080      # 200 Hello world
docker compose down
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Prompt shows `/mnt/c/...` | Opened without `--cd ~` | Use the Terminal profile, or `cd ~` |
| `which docker` shows a `/mnt/c/...` path | Windows `PATH` still appended | Redo Step 4, restart the distro |
| `permission denied ... docker.sock` | Group change not active yet | `wsl --terminate devops-lab`, reopen |
| `Permission denied (publickey)` | Public key missing on GitHub | Redo Step 6 with the `.pub` file |
| `git clone` asks for a password | HTTPS URL used | Use `git@github.com:...` |
| `code: command not found` | VS Code path wrong in `~/.bashrc` | Check the folder in Step 4 |

## Decisions behind this setup

| Decision | Reason |
|---|---|
| WSL2, not native Windows | DevOps tooling, CI, and servers are Linux |
| Dedicated distro | Separates identity, credentials, and clusters from other work |
| No Windows `PATH` in the distro | Prevents accidentally using Docker Desktop's shared engine |
| Docker Engine in the distro, not Docker Desktop | Isolated engine; same as on Linux servers; open source |
| SSH for Git | No stored passwords or tokens |
| Exact versions, verified downloads, 14-day cooldown | Updates only when chosen; compromised releases are usually caught within days |
