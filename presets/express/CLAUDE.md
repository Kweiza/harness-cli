## Express

### Build & Run
- `npm install` — install dependencies
- `npm run dev` — dev server with hot reload (tsx watch)
- `npm run build` — TypeScript build
- `npm start` — production server
- `npm test` — run Vitest tests
- `npm run lint` — ESLint check

### Project Structure
```
src/
├── index.ts              # Server startup, listen on port
├── app.ts                # Express app setup, middleware, route mounting
├── config.ts             # Environment variable validation (Zod)
├── middleware/
│   ├── auth.ts           # JWT verification middleware
│   ├── validate.ts       # Zod request validation middleware
│   ├── error-handler.ts  # Centralized error handler (MUST be last)
│   └── rate-limit.ts     # Rate limiting
├── routes/
│   ├── index.ts          # Route aggregator
│   ├── users.ts          # /api/users routes
│   └── auth.ts           # /api/auth routes
├── services/             # Business logic layer
│   └── user.service.ts
├── repositories/         # Database access layer
│   └── user.repo.ts
├── models/               # Database models / Prisma schema
│   └── user.ts
├── types/                # TypeScript type definitions
│   ├── express.d.ts      # Express type augmentation (req.user)
│   └── api.ts            # API request/response types
└── utils/
    ├── errors.ts         # Custom error classes (AppError, NotFoundError)
    ├── async-handler.ts  # Async route wrapper
    └── logger.ts         # Structured logger (pino)
tests/
├── setup.ts              # Test setup (test DB, fixtures)
├── users.test.ts
└── auth.test.ts
prisma/
├── schema.prisma         # Database schema
└── migrations/           # Prisma migrations
```

### Key Architecture Decisions
- TypeScript strict mode
- 3-layer: Route → Service → Repository
- Zod for ALL request validation (body, params, query)
- Prisma ORM for database access
- Pino for structured logging (JSON format)
- JWT for authentication (access + refresh tokens)

### Environment Variables
- Validated at startup via Zod schema in `config.ts`
- `.env` for local development (gitignored)
- Required: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`
- App crashes on startup if required vars are missing

### Error Handling Pattern
```typescript
// All routes wrapped with asyncHandler — errors go to centralized handler
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json(user);
}));
```

### Testing
- Vitest with supertest for API integration tests
- Test database: separate Prisma database via `.env.test`
- Reset DB between test suites, not between individual tests
