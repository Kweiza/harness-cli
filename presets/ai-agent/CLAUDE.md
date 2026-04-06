## AI Agent (Background)

### Build & Run
- `uv sync` — install dependencies
- `uv run python -m agent` — run agent
- `uv run python -m agent --dry-run` — test without side effects
- `uv run pytest` — run tests
- `uv run pytest --cov` — run tests with coverage
- `uv run ruff check .` — lint
- `uv run ruff format .` — format

### Project Structure
```
agent/
├── __main__.py          # Entrypoint (parse args, setup logging, run)
├── config.py            # Settings via pydantic-settings BaseSettings
├── core/
│   ├── agent.py         # Main agent loop (poll/process/sleep cycle)
│   ├── scheduler.py     # Task scheduling and rate limiting
│   └── shutdown.py      # Graceful shutdown handler (SIGTERM/SIGINT)
├── services/
│   ├── llm.py           # LLM API client (Anthropic/OpenAI wrapper)
│   ├── embedding.py     # Embedding service
│   └── storage.py       # State persistence (DB/Redis client)
├── tasks/
│   ├── base.py          # Base task interface
│   └── processors/      # Task-specific processors
│       ├── analyze.py
│       └── generate.py
├── models/
│   ├── task.py          # Task data models
│   └── result.py        # Result data models
└── utils/
    ├── retry.py         # Exponential backoff retry decorator
    ├── tokens.py        # Token counting and cost tracking
    └── logger.py        # Structured logging setup (structlog)
tests/
├── conftest.py          # Fixtures (mock LLM, mock DB)
├── test_agent.py
├── test_retry.py
└── test_processors/
```

### Key Architecture Decisions
- Stateless agent — all state stored externally (DB/Redis)
- Graceful shutdown: SIGTERM/SIGINT handlers flush state before exit
- Structured logging with structlog (JSON output, correlation IDs)
- Every external call has timeout + retry with exponential backoff
- Token usage and cost tracked per LLM call
- Configuration via environment variables (pydantic-settings)

### LLM Integration Pattern
```python
# Always use the wrapper, never call APIs directly
from agent.services.llm import LLMClient

client = LLMClient()  # reads config from env
response = await client.complete(
    messages=[{"role": "user", "content": prompt}],
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
)
# Automatically: retries, token tracking, cost logging, timeout
```

### Environment Variables
- `LLM_API_KEY` — Anthropic/OpenAI API key
- `LLM_MODEL` — default model name
- `DATABASE_URL` — state persistence
- `REDIS_URL` — optional cache/queue
- `LOG_LEVEL` — debug/info/warning/error
- `DRY_RUN` — when true, skip side effects

### Testing
- Mock all external services (LLM, DB, Redis) in tests
- Test retry logic with simulated failures
- Test shutdown handler with signal simulation
- Integration tests against real services in CI only
