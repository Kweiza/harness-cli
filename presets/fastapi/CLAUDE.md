## FastAPI

### Build & Run
- `uv sync` — install dependencies
- `uv run uvicorn app.main:app --reload` — dev server (http://localhost:8000)
- `uv run pytest` — run tests
- `uv run pytest --cov` — run tests with coverage
- `uv run ruff check .` — lint
- `uv run ruff format .` — format
- Docs: http://localhost:8000/docs (Swagger), http://localhost:8000/redoc

### Project Structure
```
app/
├── main.py              # FastAPI app instance, middleware, startup/shutdown
├── config.py            # Settings via pydantic-settings BaseSettings
├── dependencies.py      # Shared dependencies (get_db, get_current_user)
├── models/              # SQLAlchemy/SQLModel ORM models
│   ├── user.py
│   └── __init__.py
├── schemas/             # Pydantic request/response schemas
│   ├── user.py
│   └── __init__.py
├── routers/             # APIRouter modules (one per domain)
│   ├── users.py
│   ├── auth.py
│   └── __init__.py
├── services/            # Business logic layer
│   └── user_service.py
├── repositories/        # Database access layer
│   └── user_repo.py
└── utils/               # Helpers, exceptions, constants
    ├── exceptions.py    # Custom exception classes + handlers
    └── security.py      # JWT, password hashing
tests/
├── conftest.py          # Fixtures (test client, test db, mock user)
├── test_users.py
└── test_auth.py
alembic/                 # Database migrations
├── versions/
└── env.py
```

### Key Architecture Decisions
- 3-layer architecture: Router → Service → Repository
- Pydantic v2 for all request/response validation (schemas/)
- SQLAlchemy 2.0 async or SQLModel for ORM
- Alembic for database migrations
- Dependency injection via `Depends()` for DB sessions, auth, etc.
- All endpoints async by default

### Environment Variables
- Managed via `pydantic-settings` BaseSettings class
- `.env` file for local development (gitignored)
- Required: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`
- Access via `from app.config import settings`

### Testing
- pytest with `httpx.AsyncClient` for API tests
- Factory pattern for test data (not fixtures with hardcoded values)
- Test database: separate SQLite or PostgreSQL test database
- Each test function gets a clean transaction (rollback after test)
