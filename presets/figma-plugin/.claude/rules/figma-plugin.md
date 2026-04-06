---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---
# Figma Plugin Rules

## Two-Context Separation
- NEVER access `document`, `window`, or DOM APIs from `code.ts` (sandbox)
- NEVER access `figma` global from UI code (`ui.tsx`, components/)
- All cross-context communication MUST go through typed postMessage
- Define ALL message types in `types.ts` — use discriminated unions

## Node Operations
- Always check `node.type` before casting (don't assume node types)
- Batch operations: modify multiple nodes before calling `figma.commitUndo()`
- Use `figma.loadFontAsync(font)` BEFORE any `textNode.characters = ...`
- Avoid `figma.root.findAll()` on large files — scope queries to current page
- Handle `figma.mixed` values (returned when multiple nodes have different values)

## State & Storage
- Use `figma.clientStorage` for persistent user preferences (async get/set)
- Don't store large data in clientStorage — it has size limits
- Plugin UI state lives in React state — don't sync everything to clientStorage

## Error Handling
- Wrap Figma API calls in try/catch — nodes may be deleted between operations
- Validate selection exists before operating: `if (figma.currentPage.selection.length === 0)`
- Handle `figma.closePlugin()` gracefully — save state before closing
- Show user-friendly errors via `figma.notify()`, not console.log

## Performance
- Avoid `loadAllPagesAsync()` unless absolutely necessary
- Use `figma.skipInvisibleInstanceChildren = true` for faster traversal
- Debounce `selectionchange` handler — it fires frequently
- Minimize postMessage payload size — send IDs, not full node data
