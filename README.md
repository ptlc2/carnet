# Le carnet d'Antoine

Blog statique généré par Hugo, servi par nginx.

## Structure

- `hugo.toml`, `layouts/`, `content/`, `static/` : site Hugo.
- `deploy/default.conf` : configuration nginx.
- `Dockerfile` : build Hugo (base debian, binaire arm64/amd64) puis `nginx:1.27-alpine`.
- `public/` : sortie générée (non versionnée).

## Aperçu local

    hugo server

## Déploiement

`compose.yaml` monte l'application : service `server` (image `blog-antoine`, conteneur `blog-server`, alias réseau `server`, aucun port publié) sur le réseau `blog-net`.

    docker compose up -d --build

En production, un `compose.override.yaml` (gitignoré) ajoute le service `tunnel` (conteneur `blog-tunnel`, Cloudflare), et le token vit dans `.env` (gitignoré). L'ingress du dashboard Cloudflare pointe vers `http://server:80`.
