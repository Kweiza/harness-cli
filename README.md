# @kweiza/harness

Claude Code harness setup CLI for Kweiza projects. Automates project initialization with company-wide standards, stack-specific presets, and Anthropic's recommended harness engineering practices.

## Quick Start

```bash
npx @kweiza/harness init my-project
```

## Features

- **One-command setup** — Interactive CLI generates CLAUDE.md, `.claude/rules/`, hooks, and more
- **9 stack presets** — Next.js, Vite, FastAPI, Express, Figma Plugin, AI Agent, ComfyUI, Fullstack Platform, Docker
- **Composable presets** — Combine multiple presets (e.g., `nextjs + docker`)
- **Anthropic best practices** — Follows official harness engineering recommendations:
  - `CLAUDE.md` for project overview (< 200 lines)
  - `.claude/rules/` for modular, path-scoped rules
  - `.claude/settings.json` for hooks (100% enforcement)
- **Company standards** — Git workflow, code quality, testing, security, documentation rules baked in
- **Updatable** — Sync projects with latest standards via `harness update`

## Installation

```bash
# Use directly with npx (no install needed)
npx @kweiza/harness init

# Or install globally
npm install -g @kweiza/harness
```

## Commands

### `harness init [path]`

Initialize a new project with Kweiza harness standards.

```bash
npx @kweiza/harness init my-app
```

Interactive prompts will ask for:
- Project name
- Presets to apply (multi-select)
- Whether to initialize git

### `harness add <preset>`

Add a preset to an existing project. Merges into existing CLAUDE.md, settings, and rules.

```bash
cd my-existing-project
npx @kweiza/harness add fastapi
```

### `harness update`

Sync your project with the latest harness standards. Only updates CLAUDE.md, settings, and rules — never touches your scaffold files.

```bash
npx @kweiza/harness update
```

### `harness list`

Show all available presets.

```bash
npx @kweiza/harness list
```

## Available Presets

| Preset | Stack | Language |
|--------|-------|----------|
| `nextjs` | Next.js web app | TypeScript |
| `vite` | Vite web app | TypeScript |
| `fastapi` | FastAPI backend | Python |
| `express` | Express backend | TypeScript |
| `figma-plugin` | Figma plugin | TypeScript |
| `ai-agent` | Background AI agent | Python |
| `comfyui` | ComfyUI custom nodes | Python |
| `fullstack-platform` | Node-based generative AI platform | TS + Python |
| `docker` | Docker containerization | — |

## What Gets Generated

When you run `harness init`, the following structure is created in your project:

```
your-project/
├── CLAUDE.md                      # Project overview + build commands
├── .claude/
│   ├── settings.json              # Hooks (lint, format — enforced on every commit)
│   └── rules/
│       ├── git-workflow.md        # Branch naming, conventional commits
│       ├── code-quality.md        # Type safety, SRP, no magic numbers
│       ├── testing.md             # TDD, regression tests, CI gates
│       ├── security.md            # Secrets, OWASP, input validation
│       ├── documentation.md       # README, API docs
│       └── <preset>.md            # Stack-specific rules (path-scoped)
└── .gitignore
```

## How It Works

### Merge Strategy

Presets are composable. When you select multiple presets:

- **CLAUDE.md** — Base content at top, each preset appended as a section
- **settings.json** — Hooks merged into a single array (duplicates removed)
- **rules/** — All rule files copied (base + each preset). Warns if > 20 files (Anthropic limit)
- **scaffold files** — Copied without overwriting existing files

### Version Tracking

Harness writes version info to `.claude/settings.local.json` (gitignored). This lets `harness update` know which presets were applied and when.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

## License

MIT
