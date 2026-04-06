---
paths:
  - "**/*.py"
---
# FastAPI Rules

## Endpoint Design
- Every endpoint MUST specify `response_model` for type-safe responses
- Use HTTP methods correctly: GET (read), POST (create), PUT (full update), PATCH (partial), DELETE
- Return proper status codes: 200, 201 (created), 204 (no content), 400, 401, 403, 404, 422
- Use `status_code=status.HTTP_201_CREATED` for POST endpoints that create resources
- Path params for resource identity (`/users/{id}`), query params for filtering (`/users?role=admin`)

## Request Validation
- ALL request bodies validated via Pydantic schemas — never access raw dict
- Separate schemas for Create, Update, and Response (e.g., `UserCreate`, `UserUpdate`, `UserResponse`)
- Use `Field()` for constraints: `Field(min_length=1, max_length=255)`
- List endpoints return paginated results: `PaginatedResponse[UserResponse]`

## Error Handling
- Raise `HTTPException` for expected errors (not found, unauthorized, validation)
- Custom exception handlers for domain errors registered in `main.py`
- NEVER use bare `except:` — always catch specific exceptions
- Log unexpected errors with full traceback before returning 500
- Error responses follow consistent schema: `{"detail": "message"}`

## Database
- DB sessions via dependency injection: `db: AsyncSession = Depends(get_db)`
- NEVER create sessions manually in route handlers
- Use repository pattern for database queries — no raw SQL in routes/services
- Alembic for ALL schema changes — never modify DB manually

## Dependencies & Security
- Auth via `Depends(get_current_user)` — not manual token parsing in routes
- Rate limiting via middleware or dependency
- CORS configured in `main.py` — origins from environment variable, never wildcard in production
- Passwords hashed with bcrypt via passlib — NEVER store plaintext

## Async
- Use `async def` for I/O-bound endpoints (DB, HTTP calls, file I/O)
- Use `def` (sync) for CPU-bound work — FastAPI runs these in threadpool
- Await all async calls — don't fire and forget without background tasks
- Use `BackgroundTasks` for non-blocking work (email, notifications)
