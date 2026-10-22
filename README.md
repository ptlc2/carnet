# Le carnet d'Antoine

Blog statique généré par Hugo, servi par nginx, déployé en conteneur derrière un tunnel Cloudflare.

## Structure

- `hugo.toml`, `layouts/`, `content/`, `static/` : site Hugo.
- `deploy/default.conf` : configuration nginx.
- `Dockerfile` : build Hugo (base debian, binaire arm64/amd64) puis `nginx:1.27-alpine`.
- `public/` : sortie générée (non versionnée).

## Aperçu local

    hugo server

## Déploiement

    docker compose up -d --build

Le stack monte `server` (image `blog-antoine`, conteneur `ouistiti-blog`, alias réseau `server`, aucun port publié) et `cloudflared` (conteneur `cloudflared-blog`) sur le réseau `blog-net`. Le token du tunnel vit dans `.env` (gitignoré) ; l'ingress du dashboard Cloudflare pointe vers `http://server:80`.
