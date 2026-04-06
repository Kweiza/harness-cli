# Fullstack Platform Rules

## Frontend (React Flow)
- Each node type is a separate component in `frontend/src/nodes/`
- Node data schema defined in shared types between frontend and backend
- Use React Flow's built-in state management — don't duplicate in Redux/Zustand
- Validate edge connections by type — prevent incompatible node connections

## Backend (FastAPI)
- Execution engine processes DAG topologically — detect cycles before execution
- Each AI service adapter in `backend/services/` implements a common interface
- Stream long-running AI operations via WebSocket — don't block HTTP
- Store execution results for context chaining between nodes
