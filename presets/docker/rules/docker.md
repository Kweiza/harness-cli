---
paths:
  - "Dockerfile*"
  - "docker-compose*.yml"
  - "docker-compose*.yaml"
  - ".dockerignore"
---
# Docker Rules

## Dockerfile
- Multi-stage builds ALWAYS — separate deps, build, and production stages
- Pin base image versions with full tag: `node:22-alpine` not `node:latest`
- Run as non-root user in production: create user with `adduser`, then `USER appuser`
- Use `COPY --from=` to copy only needed artifacts between stages
- Order layers by change frequency: OS deps → app deps → source code
- Combine RUN commands with `&&` to reduce layers
- Use `.dockerignore` to exclude: `.git`, `node_modules`, `.env`, `dist`, `__pycache__`

## Health Checks
- Every production service MUST have a HEALTHCHECK instruction
- Health endpoint: lightweight check (DB ping, not full query)
- Reasonable intervals: `--interval=30s --timeout=3s --retries=3`

## Docker Compose
- Pin service image versions — never use `latest` in production compose
- Use named volumes for persistent data (databases)
- Set `restart: unless-stopped` for production services
- Define `depends_on` with `condition: service_healthy` for startup ordering
- Separate compose files: `docker-compose.yml` (base) + `docker-compose.dev.yml` (overrides)
- Use `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` for dev

## Security
- NEVER copy `.env` files into images
- Don't run as root — create and switch to non-root user
- Scan images for vulnerabilities: `docker scout cve`
- Use `--no-cache` for CI builds to ensure fresh dependencies
- Set `read_only: true` on containers where possible

## Performance
- Use `npm ci` (not `npm install`) in Dockerfiles for reproducible builds
- Leverage build cache: copy `package*.json` before source code
- Use Alpine-based images for smaller size
- Multi-platform builds: `docker buildx build --platform linux/amd64,linux/arm64`
