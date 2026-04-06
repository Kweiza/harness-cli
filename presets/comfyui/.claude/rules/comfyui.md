---
paths:
  - "**/*.py"
---
# ComfyUI Rules
- Custom nodes must define INPUT_TYPES, RETURN_TYPES, FUNCTION, CATEGORY as class variables
- Node FUNCTION must be a pure function — no side effects on class state
- Use ComfyUI tensor format (B, H, W, C) — convert from/to PIL as needed
- Handle GPU memory explicitly — move tensors to/from CUDA
- Register nodes in __init__.py with NODE_CLASS_MAPPINGS and NODE_DISPLAY_NAME_MAPPINGS
