---
paths:
  - "src/**/*.ts"
---
# Express Rules

## Route Handlers
- NO business logic in route handlers — delegate to service layer
- Every route wrapped with `asyncHandler()` — never write try/catch in routes
- Return proper status codes: 200, 201, 204, 400, 401, 403, 404, 500
- Use `res.status(201).json(data)` for created resources
- Group routes by resource using `express.Router()` — one file per resource

## Request Validation
- Validate ALL request input with Zod via validation middleware
- Define schemas: `createUserSchema`, `updateUserSchema`, `getUserParamsSchema`
- Validate body, params, AND query separately — never trust any input
- Validation errors return 400 with structured error details

## Error Handling
- Centralized error handler as the LAST middleware — never catch errors in routes
- Custom error classes extend base `AppError` with statusCode
- Log full error details server-side (pino), return safe message to client
- Unhandled rejections and uncaught exceptions: log and exit gracefully
- Error response shape: `{ error: { message: string, code: string } }`

## Middleware Order (in app.ts)
1. CORS
2. Helmet (security headers)
3. Body parser (express.json)
4. Rate limiting
5. Request logging (pino-http)
6. Routes
7. 404 handler
8. Error handler (LAST)

## Database
- Prisma client as singleton — import from shared module
- Transactions for multi-step operations
- Never raw SQL unless Prisma can't express the query
- Migrations via `npx prisma migrate dev`

## Security
- Helmet middleware for security headers
- Rate limiting on auth endpoints (stricter) and general endpoints
- JWT tokens: short-lived access (15min), long-lived refresh (7d)
- Password hashing with bcrypt (12 rounds minimum)
- Never log sensitive data (passwords, tokens, PII)
