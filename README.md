# Le carnet d'Antoine

Blog statique d'Antoine. Fichiers HTML générés par un petit script Node, servis par nginx.

## Structure

- `content.js` : métadonnées du site, page à propos, billets (corps en HTML).
- `build.js` : génère `site/` (index, billets, à propos, RSS) et copie `assets/`.
- `assets/` : feuille de style, favicon.
- `site/` : sortie générée (non versionnée).

## Build

```sh
node build.js
```

Variable optionnelle `BASE_URL` pour l'URL absolue dans le flux RSS.

## Image et exécution

```sh
docker build -t blog-antoine .
docker run -d --name ouistiti-blog -p 80:80 blog-antoine
```
