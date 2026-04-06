## Figma Plugin

### Build & Run
- `npm install` — install dependencies
- `npm run dev` — watch mode with hot reload
- `npm run build` — production build
- Load in Figma: Plugins > Development > Import plugin from manifest

### Key Conventions
- UI in iframe (ui.html), logic in sandbox (code.ts)
- Communicate between UI and sandbox via postMessage
- Use Figma Plugin API typings (@figma/plugin-typings)
