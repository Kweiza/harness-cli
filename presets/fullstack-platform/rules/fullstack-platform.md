# Fullstack Platform Rules

## Frontend — React Flow Nodes

### Node Components
- Each node type is a separate file in `frontend/src/nodes/`
- All nodes extend `BaseNode` wrapper for consistent handles, status indicator, and error display
- Node data types defined in `frontend/src/types/nodes.ts` — one interface per node type
- Use React Flow's `Handle` component with `type="target"` (input) and `type="source"` (output)
- Handles specify `id` matching the data field name: `<Handle id="prompt" type="target" />`

### State Management
- React Flow state (nodes, edges, viewport) in `flowStore.ts` (Zustand)
- Execution state (running, progress, results) in `executionStore.ts` (Zustand)
- Do NOT duplicate React Flow internal state — use `useReactFlow()` hook for reads
- Node configuration stored in `node.data` — update via `setNodes` or `updateNodeData`

### Edge Validation
- Validate connections before allowing: check source output type matches target input type
- Prevent cycles: run topological sort check on `onConnect`
- One connection per input handle (target) — multiple connections from output handle (source) OK
- Visual feedback: highlight compatible handles on drag

### WebSocket
- Single WebSocket connection per session for execution updates
- Message types: `node_started`, `node_completed`, `node_error`, `execution_complete`
- Reconnect with exponential backoff on disconnect
- Queue messages if WebSocket is reconnecting

## Backend — Execution Engine

### DAG Execution
- Validate DAG before execution: detect cycles with topological sort
- Execute nodes in topological order — parallel execution for independent branches
- Each node execution: load adapter → pass context → execute → store result in context
- Execution context: dict mapping `node_id:output_name` → output data
- On node failure: stop execution, report error, preserve partial results

### AI Service Adapters
- All adapters implement `BaseAdapter` interface: `async execute(input, config) -> output`
- Adapters in `backend/app/services/adapters/` — one file per provider
- Handle provider-specific errors and map to common error types
- Stream long-running operations via WebSocket — don't block HTTP
- Log token usage and latency for each adapter call

### API Design
- `POST /api/flows` — save flow definition
- `GET /api/flows/:id` — load flow
- `POST /api/flows/:id/execute` — start execution (returns execution_id)
- `GET /api/executions/:id` — get execution status and results
- `WS /api/ws/executions/:id` — real-time execution updates

### Data Types
- Shared node type definitions between frontend and backend
- Node input/output types: `text`, `image`, `video`, `3d`, `audio`, `json`
- Type validation on connection AND on execution — fail fast
