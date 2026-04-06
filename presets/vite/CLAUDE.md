## Vite

### Build & Run
- `npm install` — install dependencies
- `npm run dev` — dev server (http://localhost:5173)
- `npm run build` — production build (output in `dist/`)
- `npm run preview` — preview production build locally
- `npm test` — run Vitest tests
- `npm run lint` — ESLint check

### Project Structure
```
src/
├── main.tsx             # App entrypoint, mounts to #root
├── App.tsx              # Root component with router
├── routes/              # Page components (one per route)
│   ├── Home.tsx
│   └── Dashboard.tsx
├── components/
│   ├── ui/              # Reusable UI primitives
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── lib/
│   ├── api.ts           # API client (fetch/axios wrapper)
│   ├── utils.ts         # Utility functions
│   └── constants.ts     # App constants
├── types/               # TypeScript type definitions
├── stores/              # State management (Zustand stores)
└── assets/              # Images, fonts (processed by Vite)
public/                  # Static assets (copied as-is, not processed)
```

### Key Architecture Decisions
- React with TypeScript (strict mode)
- React Router v7 for client-side routing
- Zustand for global state management (lightweight, no boilerplate)
- TanStack Query (React Query) for server state / API caching
- Tailwind CSS for styling

### Environment Variables
- Client-exposed vars MUST use `VITE_` prefix: `VITE_API_URL`
- Access via `import.meta.env.VITE_API_URL`
- `.env` for defaults, `.env.local` for local overrides (gitignored)
- Type env vars in `src/vite-env.d.ts`

### Testing
- Vitest + React Testing Library for unit/component tests
- Playwright for E2E tests
- Test files colocated: `Component.test.tsx` next to `Component.tsx`
