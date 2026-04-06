---
paths:
  - "src/**/*.ts"
---
# Express Rules
- Use express.Router() for route grouping — one file per resource
- Validate request body/params/query with Zod middleware
- Centralized error handler as last middleware — no try/catch in routes
- Use async wrapper to catch promise rejections
- No business logic in route handlers — delegate to service layer
