import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRESETS_DIR = path.resolve(__dirname, "..", "presets");
const BASE_DIR = path.resolve(__dirname, "..", "base");

export interface PresetInfo {
  name: string;
  label: string;
  description: string;
}

export interface PresetPaths {
  name: string;
  dir: string;
  claudeMd: string;
  settings: string;
  rulesDir: string;
  scaffoldDir: string;
}

const PRESETS: PresetInfo[] = [
  { name: "nextjs", label: "Next.js", description: "Next.js web app (TypeScript)" },
  { name: "vite", label: "Vite", description: "Vite web app (TypeScript)" },
  { name: "fastapi", label: "FastAPI", description: "FastAPI backend (Python)" },
  { name: "express", label: "Express", description: "Express backend (TypeScript)" },
  { name: "figma-plugin", label: "Figma Plugin", description: "Figma plugin (TypeScript)" },
  { name: "ai-agent", label: "AI Agent", description: "Background AI agent (Python)" },
  { name: "comfyui", label: "ComfyUI", description: "ComfyUI custom nodes (Python)" },
  { name: "fullstack-platform", label: "Fullstack Platform", description: "Node-based generative AI platform" },
  { name: "docker", label: "Docker", description: "Docker containerization" },
];

export function getPresetList(): PresetInfo[] {
  return PRESETS;
}

export function getPresetDir(name: string): string {
  const preset = PRESETS.find((p) => p.name === name);
  if (!preset) {
    throw new Error(`Unknown preset: ${name}`);
  }
  return path.join(PRESETS_DIR, name);
}

export function getBaseDir(): string {
  return BASE_DIR;
}

export function loadPreset(name: string): PresetPaths {
  const dir = getPresetDir(name);
  return {
    name,
    dir,
    claudeMd: path.join(dir, "CLAUDE.md"),
    settings: path.join(dir, ".claude", "settings.json"),
    rulesDir: path.join(dir, ".claude", "rules"),
    scaffoldDir: path.join(dir, "scaffold"),
  };
}
