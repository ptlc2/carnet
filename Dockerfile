FROM debian:bookworm-slim AS build

ARG HUGO_VERSION=0.168.0

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates tar \
 && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "$ARCH" in \
      arm64) HARCH=arm64 ;; \
      amd64) HARCH=amd64 ;; \
      *) echo "architecture non gérée: $ARCH" >&2; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${HARCH}.tar.gz" -o /tmp/hugo.tgz; \
    tar -xzf /tmp/hugo.tgz -C /usr/local/bin hugo; \
    rm /tmp/hugo.tgz; \
    hugo version

WORKDIR /src
COPY . .
RUN hugo --minify

FROM nginx:1.27-alpine
COPY --from=build /src/public /usr/share/nginx/html
EXPOSE 80
