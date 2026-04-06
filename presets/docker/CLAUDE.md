## Docker

### Build & Run
- `docker compose up -d` — start all services
- `docker compose down` — stop all services
- `docker compose build` — rebuild images
- `docker compose build --no-cache` — rebuild from scratch
- `docker compose logs -f [service]` — follow logs
- `docker compose exec [service] sh` — shell into container
- `docker compose ps` — list running services

### Project Structure
```
Dockerfile               # Production multi-stage build
Dockerfile.dev           # Development build (with hot reload)
docker-compose.yml       # Production compose
docker-compose.dev.yml   # Development overrides
docker-compose.test.yml  # Test environment
.dockerignore            # Exclude from build context
```

### Multi-Stage Build Pattern
```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]
```

### Environment Variables
- Never bake secrets into images — pass at runtime via environment/secrets
- Use `.env` file with `docker compose` (listed in `.gitignore`)
- Production: use Docker secrets or external secret manager

### Common Services (docker-compose)
- `app` — application container
- `db` — PostgreSQL/MySQL
- `redis` — cache/session store
- `nginx` — reverse proxy (production)
