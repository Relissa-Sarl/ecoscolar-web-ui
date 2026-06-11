# Public Gateway Deployment

This deployment profile runs the public EcoScolar demo stack behind a single Nginx gateway.

## Architecture

```text
Tailscale Funnel / Serve
  -> ecoscolar-gateway:80
       /         -> ecoscolar-frontend:80
       /api/v1   -> ecoscolar-backend:8080/api/v1
       /login    -> ecoscolar-backend:8080/login
       /refresh  -> ecoscolar-backend:8080/refresh
       /mailpit  -> ecoscolar-mailpit:8025
```

Only the gateway publishes a host port. The backend, frontend and Mailpit containers stay on the
private Docker network.

## Setup

Copy the example environment file and fill in the SQL connection string and Stripe key:

```bash
cp .env.example .env
nano .env
```

If containers were previously started manually, remove them before switching to this Compose stack:

```bash
docker rm -f ecoscolar-frontend ecoscolar-backend ecoscolar-gateway ecoscolar-mailpit
```

Pull the latest images and start the stack:

```bash
docker compose pull
docker compose up -d
```

Check the gateway locally:

```bash
curl -i http://127.0.0.1:3100/health
curl -i http://127.0.0.1:3100/api/v1/adverts/summary
```

Expose the gateway with Tailscale:

```bash
sudo tailscale serve https:443 / http://127.0.0.1:3100
sudo tailscale funnel 443 on
```

## Public URLs

```text
https://<TAILSCALE_HOSTNAME>/
https://<TAILSCALE_HOSTNAME>/api/v1/adverts/summary
https://<TAILSCALE_HOSTNAME>/mailpit/
```

## Stop

```bash
docker compose down
```
