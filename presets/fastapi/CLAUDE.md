## FastAPI

### Build & Run
- `uv sync` — install dependencies
- `uv run uvicorn main:app --reload` — dev server
- `uv run pytest` — run tests
- `uv run ruff check .` — lint

### Key Conventions
- Pydantic v2 models for request/response schemas
- Use Depends() for dependency injection
- Async endpoints by default
