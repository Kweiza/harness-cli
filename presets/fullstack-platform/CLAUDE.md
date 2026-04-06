## Fullstack Platform (Node-based AI)

### Build & Run
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && uv run uvicorn main:app --reload`
- Full stack: `docker compose up -d`
- Tests: `npm test` (frontend) / `uv run pytest` (backend)

### Key Conventions
- Node-based UI with React Flow
- Each node type connects to a generative AI service
- Context flows through edges — output of one node feeds input of next
- Backend orchestrates AI service calls and manages execution graph
