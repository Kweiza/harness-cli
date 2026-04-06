---
paths:
  - "Dockerfile*"
  - "docker-compose*.yml"
  - "docker-compose*.yaml"
  - ".dockerignore"
---
# Docker Rules
- Use multi-stage builds to keep production images small
- Pin base image versions with SHA digests for reproducibility
- Run as non-root user in production containers
- Use .dockerignore — exclude node_modules, .git, .env
- One process per container — use docker compose for multi-service
- Health checks required for production services
