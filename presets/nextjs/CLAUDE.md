## Next.js

### Build & Run
- `npm install` — install dependencies
- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build
- `npm test` — run tests
- `npm run lint` — ESLint check

### Project Structure
```
app/
├── layout.tsx          # Root layout (shared across all pages)
├── page.tsx            # Home page
├── globals.css         # Global styles
├── api/                # API Route handlers
│   └── [resource]/
│       └── route.ts    # GET, POST, PUT, DELETE handlers
├── (auth)/             # Route group for auth pages
│   ├── login/page.tsx
│   └── signup/page.tsx
└── [dynamic]/          # Dynamic route segments
    └── page.tsx
components/
├── ui/                 # Reusable UI primitives (Button, Input, Modal)
└── features/           # Feature-specific components (UserCard, PostList)
lib/
├── api.ts              # API client / fetch wrappers
├── utils.ts            # Shared utility functions
└── constants.ts        # App-wide constants
types/
└── index.ts            # Shared TypeScript types/interfaces
```

### Key Architecture Decisions
- App Router with Server Components by default
- `'use client'` only for components needing browser APIs, state, or effects
- Server Actions for form mutations instead of API routes when possible
- Middleware (`middleware.ts` at root) for auth guards, redirects, i18n
- Route groups `(groupName)` for layout organization without affecting URL

### Data Fetching
- Server Components: fetch directly in component body (auto-cached)
- Client Components: use SWR or React Query with API routes
- Server Actions: for mutations that need form handling
- Revalidation: `revalidatePath()` or `revalidateTag()` after mutations

### Styling
- Tailwind CSS as primary styling solution
- CSS Modules for component-scoped styles when Tailwind isn't sufficient
- No inline style objects unless dynamic values require it

### Testing
- Vitest + React Testing Library for component tests
- Playwright for E2E tests
- Test files colocated: `Component.test.tsx` next to `Component.tsx`
