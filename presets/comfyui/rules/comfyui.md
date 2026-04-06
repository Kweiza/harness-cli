---
paths:
  - "**/*.py"
---
# ComfyUI Rules

## Node Definition
- Every node class MUST define: `INPUT_TYPES` (classmethod), `RETURN_TYPES`, `FUNCTION`, `CATEGORY`
- `INPUT_TYPES` returns dict with `"required"` and optionally `"optional"` keys
- `RETURN_TYPES` is a tuple of type strings: `("IMAGE",)`, `("IMAGE", "MASK")`
- `FUNCTION` names the method to call — this method receives inputs as kwargs
- Include `RETURN_NAMES` for better UI labels
- Register ALL nodes in `__init__.py` via `NODE_CLASS_MAPPINGS` and `NODE_DISPLAY_NAME_MAPPINGS`

## Tensor Handling
- ComfyUI format: `(B, H, W, C)` float32 [0, 1] — ALWAYS validate this assumption
- Convert to/from PyTorch: `.permute(0, 3, 1, 2)` and `.permute(0, 2, 3, 1)`
- Convert to PIL: `(tensor[0].numpy() * 255).astype(np.uint8)` then `Image.fromarray()`
- Clamp output values to [0, 1]: `torch.clamp(result, 0.0, 1.0)`
- Preserve batch dimension — never squeeze it out

## GPU Memory
- Move tensors to GPU only when needed, back to CPU when done
- Use `torch.no_grad()` for inference — don't accumulate gradients
- Call `torch.cuda.empty_cache()` after large operations in finally block
- For model loading: check VRAM availability before loading, offload if needed
- Use `model_cache` for frequently used models — don't reload every execution

## Node Function Purity
- The FUNCTION method should be pure: same inputs → same outputs
- NO side effects on class state (no `self.` mutations between calls)
- File I/O only for explicit save/load nodes — never implicitly
- Return new tensors — never modify input tensors in place

## Error Handling
- Validate inputs at the start of FUNCTION: check shapes, dtypes, ranges
- Raise clear ValueError with node name and expected vs actual: `"MyNode: expected (B,H,W,C) got {shape}"`
- Handle optional inputs: check for None before using
- GPU errors (OOM): catch RuntimeError, free memory, give helpful error message

## Type Definitions
- Standard types: `IMAGE`, `MASK`, `LATENT`, `MODEL`, `CLIP`, `VAE`, `CONDITIONING`, `STRING`, `INT`, `FLOAT`
- Numeric types support: `default`, `min`, `max`, `step` in INPUT_TYPES
- STRING supports: `default`, `multiline` (bool)
- Use `COMBO` type for dropdown selections: `(["option1", "option2"],)`
