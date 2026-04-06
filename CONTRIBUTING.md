# Contributing to @kweiza/harness

Thanks for your interest in contributing! This document explains how to get started.

## Development Setup

```bash
git clone https://github.com/kweiza/harness-cli.git
cd harness-cli
npm install
```

### Run in development

```bash
npm run dev -- list          # Run CLI commands
npm run dev -- init my-app   # Test init flow
```

### Run tests

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
```

### Build

```bash
npm run build         # Compile TypeScript to dist/
```

## Project Structure

```
harness-cli/
├── cli/                   # CLI source code
│   ├── index.ts           # Entrypoint (commander setup)
│   ├── commands/          # CLI commands (init, add, list, update)
│   ├── prompts.ts         # Interactive prompts (inquirer)
│   ├── generator.ts       # Orchestrates file generation
│   ├── merge.ts           # Merge logic for CLAUDE.md, settings, rules
│   ├── presets.ts         # Preset registry
│   └── version.ts         # Version tracking
├── base/                  # Company-wide standards (applied to all projects)
│   ├── CLAUDE.md
│   ├── .claude/
│   │   ├── settings.json
│   │   └── rules/         # 5 base rule files
│   └── .gitignore
├── presets/               # Stack-specific presets
│   ├── nextjs/
│   ├── fastapi/
│   └── ...                # 9 presets total
└── tests/                 # Vitest tests
```

## Adding a New Preset

1. Create a new directory under `presets/`:

```
presets/my-preset/
├── CLAUDE.md                    # Build & run commands, key conventions
├── .claude/
│   ├── settings.json            # Hooks (lint, format, etc.)
│   └── rules/
│       └── my-preset.md         # Stack-specific rules (with optional paths: frontmatter)
└── scaffold/                    # Optional template files
```

2. Register the preset in `cli/presets.ts`:

```typescript
{ name: "my-preset", label: "My Preset", description: "Description here" },
```

3. Add tests in `tests/` to verify generation works with the new preset.

4. Run `npm test` to make sure everything passes.

## Guidelines

- **Keep CLAUDE.md short** — Under 200 lines per file (Anthropic recommendation)
- **Rules files** — One topic per file, use `paths:` frontmatter for scoping when possible
- **Hooks** — Only for things that must run 100% of the time (lint, format). Guidelines go in rules/
- **Max 20 rule files** — Anthropic enforces a 20-file limit. Current base (5) + 9 presets (1 each) = 14
- **No scaffold overwrites** — Scaffold files never overwrite existing files

## Pull Request Process

1. Create a feature branch: `feature/my-change`
2. Write/update tests
3. Run `npm test` — all tests must pass
4. Submit a PR with a clear description
5. One reviewer approval required

## Code Style

- TypeScript strict mode
- ESM imports (`.js` extensions in imports)
- Vitest for testing
- Conventional Commits for commit messages

## Reporting Issues

Open an issue on [GitHub](https://github.com/kweiza/harness-cli/issues) with:
- What you expected
- What actually happened
- Steps to reproduce
- Your Node.js version (`node -v`)
