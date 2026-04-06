---
paths:
  - "**/*.py"
---
# AI Agent Rules
- All external API calls must have timeout and retry with exponential backoff
- Use structured logging (structlog) — no print() statements
- Handle SIGTERM/SIGINT for graceful shutdown
- Store state externally (DB/Redis) — agent must be stateless and restartable
- Rate limit API calls — respect provider quotas
- Log token usage and costs for each LLM call
