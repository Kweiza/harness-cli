## Figma Plugin

### Build & Run
- `npm install` — install dependencies
- `npm run dev` — watch mode with hot reload
- `npm run build` — production build
- Load in Figma: Plugins > Development > Import plugin from manifest

### Project Structure
```
src/
├── code.ts              # Plugin sandbox (Figma API access, no DOM)
├── ui.tsx               # Plugin UI (React, rendered in iframe)
├── ui.html              # UI entrypoint HTML
├── types.ts             # Shared message types between code.ts and ui.tsx
├── lib/
│   ├── figma-helpers.ts # Figma node manipulation utilities
│   ├── styles.ts        # Style extraction/application helpers
│   └── messages.ts      # Type-safe postMessage wrappers
└── components/          # UI components (React)
manifest.json            # Figma plugin manifest
```

### Architecture
- **Two-context model:** sandbox (`code.ts`) and UI (`ui.tsx`) run in separate contexts
- Sandbox: full Figma Plugin API access, NO DOM, NO browser APIs
- UI: full DOM/browser access, NO Figma API access
- Communication: `figma.ui.postMessage()` (sandbox→UI) and `parent.postMessage()` (UI→sandbox)

### Message Passing Pattern
```typescript
// types.ts — shared between code.ts and ui.tsx
type PluginMessage =
  | { type: 'selection-changed'; nodes: NodeInfo[] }
  | { type: 'apply-style'; styleId: string }
  | { type: 'export-result'; data: Uint8Array }
```

### Key APIs
- `figma.currentPage.selection` — get selected nodes
- `figma.createRectangle()`, `figma.createText()` — create nodes
- `figma.loadFontAsync()` — MUST call before setting text content
- `figma.clientStorage` — persistent key-value store (async)
- `figma.notify()` — toast notifications in Figma UI
- `figma.closePlugin()` — clean exit

### Testing
- Vitest for pure logic (helpers, message handlers)
- Mock `figma` global in tests using `@figma/plugin-typings`
- UI components: React Testing Library
