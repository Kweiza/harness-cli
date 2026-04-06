---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---
# Figma Plugin Rules
- UI code and sandbox code must be strictly separated
- Use figma.ui.postMessage() and figma.ui.onmessage for communication
- Never access DOM from sandbox (code.ts) — DOM is UI-only
- Handle plugin close gracefully with figma.closePlugin()
- Store persistent data with figma.clientStorage (async)
- Batch node operations to avoid performance issues — use loadAllPagesAsync() sparingly
