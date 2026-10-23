#!/bin/sh
# Rend une illustration SVG en PNG via librsvg, dans un conteneur éphémère.
# Usage : deploy/render-svg.sh <entree.svg> <sortie.png> [largeur]
set -eu

in="$1"
out="$2"
w="${3:-1200}"

if ! docker image inspect svg-render >/dev/null 2>&1; then
  docker build -q -t svg-render - >/dev/null <<'EOF'
FROM debian:bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends librsvg2-bin \
 && rm -rf /var/lib/apt/lists/*
EOF
fi

docker run --rm -i svg-render rsvg-convert -w "$w" -f png < "$in" > "$out"
