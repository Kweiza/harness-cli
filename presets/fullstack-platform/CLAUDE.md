## Fullstack Platform (Node-based AI)

### Build & Run
- Frontend: `cd frontend && npm run dev` (http://localhost:5173)
- Backend: `cd backend && uv run uvicorn app.main:app --reload` (http://localhost:8000)
- Full stack: `docker compose up -d`
- Frontend tests: `cd frontend && npm test`
- Backend tests: `cd backend && uv run pytest`
- API docs: http://localhost:8000/docs

### Project Structure
```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx              # React Flow canvas + panels
│   ├── nodes/               # Custom node components
│   │   ├── TextGenerateNode.tsx
│   │   ├── ImageGenerateNode.tsx
│   │   ├── VideoGenerateNode.tsx
│   │   └── BaseNode.tsx     # Shared node wrapper (handles, status)
│   ├── edges/               # Custom edge types
│   │   └── DataEdge.tsx
│   ├── panels/              # Side panels (properties, history)
│   ├── stores/
│   │   ├── flowStore.ts     # React Flow state (Zustand)
│   │   └── executionStore.ts # Execution state
│   ├── hooks/
│   │   ├── useExecution.ts  # Execute flow, track progress
│   │   └── useWebSocket.ts  # Real-time execution updates
│   ├── lib/
│   │   ├── api.ts           # Backend API client
│   │   ├── flow-utils.ts    # DAG validation, topological sort
│   │   └── types.ts         # Shared node/edge types
│   └── types/
│       └── nodes.ts         # Node data types per node type
backend/
├── app/
│   ├── main.py              # FastAPI app, WebSocket endpoint
│   ├── config.py            # Settings
│   ├── routers/
│   │   ├── flows.py         # CRUD for flow definitions
│   │   ├── execute.py       # Flow execution endpoint
│   │   └── ws.py            # WebSocket for real-time updates
│   ├── services/
│   │   ├── executor.py      # DAG executor (topological order)
│   │   ├── context.py       # Execution context (passes data between nodes)
│   │   └── adapters/        # AI service adapters
│   │       ├── base.py      # Abstract adapter interface
│   │       ├── anthropic.py # Claude API adapter
│   │       ├── openai.py    # OpenAI adapter
│   │       ├── stability.py # Stability AI adapter
│   │       └── replicate.py # Replicate adapter
│   ├── models/
│   │   ├── flow.py          # Flow, Node, Edge DB models
│   │   └── execution.py     # Execution history
│   └── utils/
│       ├── dag.py           # DAG cycle detection, topological sort
│       └── streaming.py     # SSE/WebSocket streaming helpers
docker-compose.yml
```

### Key Architecture Decisions
- Frontend: React Flow for node canvas, Zustand for state, WebSocket for live updates
- Backend: FastAPI for REST + WebSocket, adapter pattern for AI services
- Execution: Backend receives DAG → validates → executes topologically → streams results
- Context chaining: each node's output stored in execution context, available to downstream nodes
- AI service adapters implement common interface for swap-ability

### Node Data Flow
```
[Text Input] → [LLM Generate] → [Image Generate] → [Output]
     ↓              ↓                   ↓              ↓
  "prompt"    "generated text"   "generated image"   "save"
```
Each edge carries typed data. Nodes declare input/output types. Incompatible connections rejected.
