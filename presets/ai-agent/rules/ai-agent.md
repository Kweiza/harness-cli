---
paths:
  - "**/*.py"
---
# AI Agent Rules

## External API Calls
- ALL external API calls MUST have timeout: `timeout=30` minimum
- ALL external API calls MUST have retry with exponential backoff
- Use the retry decorator: `@retry(max_attempts=3, backoff_base=2)`
- Respect rate limits — implement token bucket or leaky bucket per provider
- Log every API call: method, endpoint, latency, status code

## LLM Specific
- NEVER call LLM APIs directly — use the LLMClient wrapper
- Log token usage (input/output) and estimated cost for every LLM call
- Set `max_tokens` explicitly on every call — never rely on defaults
- Handle rate limit errors (429) with longer backoff than other errors
- Validate LLM output before acting on it — models can return unexpected formats
- Use structured output (JSON mode / tool use) when possible

## Logging
- Use structlog — NEVER use `print()` statements
- Every log entry must include correlation ID for request tracing
- Log levels: DEBUG for internal state, INFO for operations, WARNING for retries, ERROR for failures
- Log at function boundaries: entry (DEBUG) and exit/error (INFO/ERROR)
- NEVER log secrets, API keys, or full API responses (truncate to first 200 chars)

## State Management
- Agent must be stateless and restartable — all state in external storage
- Implement idempotency keys for operations that must not repeat
- Use transactions for multi-step state updates
- Check for stale state on startup — resume or clean up incomplete work

## Graceful Shutdown
- Handle SIGTERM and SIGINT signals
- On shutdown: finish current task, flush logs, close connections, then exit
- Set maximum shutdown timeout (30s) — force exit if exceeded
- Never start new work after shutdown signal received

## Error Handling
- Categorize errors: transient (retry) vs permanent (fail and report)
- Transient: network timeout, rate limit, 5xx responses
- Permanent: 4xx responses (except 429), validation errors, auth failures
- Dead letter queue for permanently failed tasks — don't retry forever
- Alert/notify on repeated permanent failures (circuit breaker pattern)
