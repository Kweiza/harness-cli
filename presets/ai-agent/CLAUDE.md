## AI Agent (Background)

### Build & Run
- `uv sync` — install dependencies
- `uv run python -m agent` — run agent
- `uv run pytest` — run tests
- `uv run ruff check .` — lint

### Key Conventions
- Structured logging with structlog
- Graceful shutdown handling (SIGTERM/SIGINT)
- Configuration via environment variables with pydantic-settings
- Retry logic with exponential backoff for external API calls
