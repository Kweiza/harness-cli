## ComfyUI

### Build & Run
- `uv sync` — install dependencies
- `uv run python main.py` — run ComfyUI server
- `uv run pytest` — run tests
- `uv run ruff check .` — lint

### Key Conventions
- Custom nodes in `custom_nodes/` directory
- Each node is a self-contained class with INPUT_TYPES and RETURN_TYPES
- Use ComfyUI's built-in type system for node connections
