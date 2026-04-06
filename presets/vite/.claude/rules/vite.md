---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---
# Vite Rules
- Use VITE_ prefix for client-exposed environment variables
- Lazy load routes with React.lazy or dynamic import
- Static assets in public/ — referenced assets in src/assets/
- Configure proxy in vite.config.ts for API calls during development
