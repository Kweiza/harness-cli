---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
  - "app/**/*.tsx"
  - "app/**/*.ts"
  - "components/**/*.tsx"
  - "components/**/*.ts"
  - "lib/**/*.ts"
---
# Next.js Rules

## Server vs Client Components
- Server Components by default — no `'use client'` unless needed
- NEVER use useState, useEffect, useRef, or event handlers in Server Components
- Move interactive parts to a separate Client Component and import it
- Server Components CAN: fetch data, access backend, read cookies/headers
- Client Components CANNOT: use async/await directly, access fs/db

## Routing & Navigation
- Use next/link for all internal navigation — never use `<a>` tags for internal links
- Use next/image for all images — set width/height or use `fill` prop
- Dynamic routes: use `[param]` for single, `[...param]` for catch-all
- Loading states: add `loading.tsx` to route segments for Suspense boundaries
- Error boundaries: add `error.tsx` (must be Client Component with `'use client'`)

## Data & State
- Fetch in Server Components when possible — avoid client-side fetching for initial data
- Use `cache()` from React for request deduplication in Server Components
- For shared client state: React Context at lowest possible level, not global providers
- URL search params for filterable/shareable UI state (use `useSearchParams`)
- Avoid prop drilling beyond 2 levels — extract into composition or context

## Performance
- Use `dynamic(() => import(...))` for heavy components not needed on initial load
- Add `loading.tsx` to route segments for streaming/progressive rendering
- Images: always provide `sizes` prop when using responsive images
- Avoid barrel files (index.ts re-exports) — they break tree shaking

## API Routes
- Validate request body with Zod in every route handler
- Return proper HTTP status codes: 200, 201, 400, 401, 404, 500
- Use NextResponse.json() for responses
- Handle errors explicitly — don't let unhandled errors leak to client

## Environment Variables
- Server-only: `DB_URL`, `API_SECRET` (no prefix)
- Client-exposed: `NEXT_PUBLIC_API_URL` (NEXT_PUBLIC_ prefix required)
- NEVER expose secrets via NEXT_PUBLIC_ prefix
- Validate env vars at build time with `@t3-oss/env-nextjs` or manual check
