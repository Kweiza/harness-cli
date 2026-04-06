---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---
# Vite + React Rules

## Component Patterns
- Functional components only — no class components
- Export named components (not default) for better refactoring support
- One component per file, file name matches component name (PascalCase)
- Colocate styles, tests, and types with their component

## Hooks
- Custom hooks must start with `use` prefix
- Extract complex logic into custom hooks — keep components focused on rendering
- Use `useMemo`/`useCallback` only when there's a measured performance issue — don't premature optimize
- Never call hooks conditionally or inside loops

## State Management
- Local state (useState) for component-specific state
- Zustand stores for shared/global state — one store per domain
- TanStack Query for server state — never store API data in Zustand
- URL search params for filterable/shareable state

## Routing
- Lazy load route components: `React.lazy(() => import('./routes/Page'))`
- Wrap lazy routes in `<Suspense fallback={<Loading />}>`
- Keep route definitions in a single file for overview

## Performance
- Use VITE_ prefix for all client environment variables
- Static assets in `public/` — imported assets in `src/assets/`
- Configure API proxy in `vite.config.ts` for development
- Avoid barrel files — import directly from source files
- Code split at route level minimum

## Error Handling
- Error boundaries at route level: catch and display errors gracefully
- API errors: handle in TanStack Query's `onError` or error boundary
- Form validation: validate on submit, show inline errors
