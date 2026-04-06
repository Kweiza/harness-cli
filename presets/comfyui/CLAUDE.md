## ComfyUI

### Build & Run
- `uv sync` — install dependencies
- `uv run python main.py` — run ComfyUI server
- `uv run python main.py --listen 0.0.0.0` — expose to network
- `uv run pytest` — run tests
- `uv run ruff check .` — lint

### Project Structure
```
custom_nodes/
├── __init__.py          # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
├── nodes/
│   ├── image_process.py # Image processing nodes
│   ├── text_generate.py # Text generation nodes
│   ├── model_load.py    # Model loading nodes
│   └── output.py        # Output/save nodes
├── lib/
│   ├── tensor_utils.py  # Tensor format conversion helpers
│   ├── model_cache.py   # Model caching to avoid reloading
│   └── gpu_utils.py     # GPU memory management
└── tests/
    ├── conftest.py      # Fixtures (sample tensors, mock models)
    ├── test_image.py
    └── test_text.py
```

### Custom Node Template
```python
class MyCustomNode:
    CATEGORY = "custom/my_category"
    FUNCTION = "execute"
    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                "strength": ("FLOAT", {"default": 1.0, "min": 0.0, "max": 2.0, "step": 0.1}),
            },
            "optional": {
                "mask": ("MASK",),
            },
        }

    def execute(self, image, strength, mask=None):
        # image shape: (B, H, W, C), float32, range [0, 1]
        result = image * strength
        return (result,)
```

### Tensor Format
- ComfyUI images: `(B, H, W, C)` — float32, range [0, 1]
- PyTorch standard: `(B, C, H, W)` — convert with `.permute(0, 3, 1, 2)`
- PIL conversion: `Image.fromarray((tensor[0].numpy() * 255).astype(np.uint8))`
- Masks: `(B, H, W)` — single channel, float32

### Testing
- Test nodes with synthetic tensors (torch.rand)
- Test edge cases: batch size > 1, different resolutions, mask=None
- Mock model loading in unit tests (models are too large)
