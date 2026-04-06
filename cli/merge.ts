import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import fse from "fs-extra";

const MAX_RULES = 20;

export function mergeClaudeMd(basePath: string, presetPaths: string[]): string {
  const parts: string[] = [];

  if (existsSync(basePath)) {
    parts.push(readFileSync(basePath, "utf-8").trimEnd());
  }

  for (const presetPath of presetPaths) {
    if (existsSync(presetPath)) {
      parts.push(readFileSync(presetPath, "utf-8").trimEnd());
    }
  }

  return parts.join("\n\n---\n\n") + "\n";
}

export function countLines(content: string): number {
  return content.split("\n").length;
}

interface HookEntry {
  command: string;
}

interface Settings {
  hooks: {
    PreCommit: HookEntry[];
    [key: string]: HookEntry[];
  };
  [key: string]: unknown;
}

export function mergeSettings(base: Settings, presets: Settings[]): Settings {
  const result: Settings = JSON.parse(JSON.stringify(base));

  for (const preset of presets) {
    if (!preset.hooks) continue;

    for (const [hookName, hookEntries] of Object.entries(preset.hooks)) {
      if (!result.hooks[hookName]) {
        result.hooks[hookName] = [];
      }

      for (const entry of hookEntries) {
        const exists = result.hooks[hookName].some(
          (existing) => existing.command === entry.command
        );
        if (!exists) {
          result.hooks[hookName].push(entry);
        }
      }
    }
  }

  return result;
}

export function mergeRules(
  sourceDirs: string[],
  targetDir: string
): string[] {
  const warnings: string[] = [];

  fse.ensureDirSync(targetDir);

  let totalFiles = 0;

  for (const sourceDir of sourceDirs) {
    if (!existsSync(sourceDir)) continue;

    const files = readdirSync(sourceDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      fse.copySync(join(sourceDir, file), join(targetDir, file));
      totalFiles++;
    }
  }

  if (totalFiles > MAX_RULES) {
    warnings.push(
      `Warning: ${totalFiles} rule files exceed the Anthropic limit of 20. Consider consolidating related rules.`
    );
  }

  return warnings;
}
