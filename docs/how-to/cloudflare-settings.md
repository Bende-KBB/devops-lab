# Domain and Cloudflare Settings

Settings for the domain and the tunnel. They live in name.com and Cloudflare, **not in Git**: this page is their record.

## Domain: name.com

| Setting | Value | Why |
|---|---|---|
| Domain | `devops-pipe.live` | |
| Expires | 2027-11-15 | Registered for one year |
| Automatic renewal | Off | Expiry is a deliberate decision |
| WHOIS privacy | On | Contact details hidden from public lookups |
| Transfer lock | On | The domain can't be moved to another registrar without unlocking |
| Domain Lock Plus | On | Settings (including nameservers) can't be changed without unlocking |
| Nameservers | `mckenzie.ns.cloudflare.com`, `todd.ns.cloudflare.com` | Cloudflare answers DNS for the domain |
| Account | Two-factor authentication on | |

## Cloudflare: DNS

| Record | Value | Created by |
|---|---|---|
| `CNAME devops-pipe.live` | `<tunnel-id>.cfargotunnel.com`, proxied | The tunnel route (automatically) |

No other records: the domain serves only the tunnel's route, and no email.

## Cloudflare: tunnel

**Zero Trust → Networks → Tunnels** (Free plan)

| Setting | Value |
|---|---|
| Tunnel | `devops-pipe` (dashboard-managed) |
| Route | `devops-pipe.live` → `http://app:3000` |
| Additional application settings | Defaults |

## The token

- **Where:** `tunnel.env` in the repository folder (one line: `TUNNEL_TOKEN=<token>`; ignored by Git; `chmod 600`), and the Kubernetes Secret `tunnel-token`, created from that file.
- **Getting it again:** the tunnel's page in the dashboard → the connector install command contains `--token <token>`.
- **Rotating it** (after a leak or a lost laptop): the tunnel's settings in the dashboard → refresh / rotate the token; replace the line in `tunnel.env`; `docker compose up -d`. Then recreate the Secret (kubectl delete secret tunnel-token, kubectl create secret ...) and restart the connectors (kubectl rollout restart deployment/tunnel).

## Account

- **Two-factor authentication:** on.
- **Zero Trust Free plan:** a payment method is on file (required); nothing paid is enabled.