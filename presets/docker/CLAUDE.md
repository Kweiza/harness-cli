## Docker

### Build & Run
- `docker compose up -d` — start all services
- `docker compose down` — stop all services
- `docker compose build` — rebuild images
- `docker compose logs -f` — follow logs

### Key Conventions
- Multi-stage builds for production images
- Use .dockerignore to exclude unnecessary files
- Pin base image versions — no `latest` tag
