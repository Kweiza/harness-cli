import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export interface HarnessVersion {
  version: string;
  presets: string[];
  lastUpdated: string;
}

export function createVersionInfo(presets: string[]): { _harness: HarnessVersion } {
  return {
    _harness: {
      version: "1.0.0",
      presets,
      lastUpdated: new Date().toISOString().split("T")[0],
    },
  };
}

export function readVersionInfo(targetDir: string): HarnessVersion | null {
  const filePath = join(targetDir, ".claude", "settings.local.json");
  if (!existsSync(filePath)) return null;

  const content = JSON.parse(readFileSync(filePath, "utf-8"));
  return content._harness ?? null;
}
