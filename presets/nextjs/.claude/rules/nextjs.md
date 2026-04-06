---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
  - "app/**/*.tsx"
  - "app/**/*.ts"
---
# Next.js Rules
- No useState/useEffect in Server Components
- Use next/image for all images
- Use next/link for all internal links
- Prefix client-exposed env vars with NEXT_PUBLIC_
- Use dynamic imports for code splitting heavy components
- Place shared layouts in layout.tsx, not duplicated across pages
