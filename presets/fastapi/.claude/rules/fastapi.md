---
paths:
  - "**/*.py"
---
# FastAPI Rules
- Always specify response_model on endpoints
- Use HTTPException for errors — no bare except
- Manage DB sessions via dependency injection
- Use pydantic-settings BaseSettings for environment variables
- Group routes with APIRouter, one router per domain
- Async def for I/O-bound endpoints, def for CPU-bound
