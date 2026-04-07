import { join } from "node:path";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import fse from "fs-extra";
import { getBaseDir, loadPreset } from "./presets.js";
import { mergeClaudeMd, mergeSettings, mergeRules, countLines } from "./merge.js";
import { createVersionInfo } from "./version.js";

export interface GenerateOptions {
  targetDir: string;
  presets: string[];
}

export interface GenerateResult {
  warnings: string[];
}

export function generate(options: GenerateOptions): GenerateResult {
  const { targetDir, presets } = options;
  const warnings: string[] = [];
  const baseDir = getBaseDir();

  // Load preset paths
  const presetData = presets.map((name) => loadPreset(name));

  // 1. Merge CLAUDE.md
  const existingMdPath = join(targetDir, "CLAUDE.md");
  const baseMdPath = existsSync(existingMdPath) ? existingMdPath : join(baseDir, "CLAUDE.md");
  const presetMdPaths = presetData
    .map((p) => p.claudeMd)
    .filter((p) => existsSync(p));

  const mergedMd = mergeClaudeMd(baseMdPath, presetMdPaths);
  const lineCount = countLines(mergedMd);
  if (lineCount > 200) {
    warnings.push(
      `Warning: CLAUDE.md is ${lineCount} lines (recommended: under 200).`
    );
  }
  writeFileSync(join(targetDir, "CLAUDE.md"), mergedMd);

  // 2. Merge settings.json
  const baseSettingsPath = join(baseDir, ".claude", "settings.json");
  const baseSettings = existsSync(baseSettingsPath)
    ? JSON.parse(readFileSync(baseSettingsPath, "utf-8"))
    : { hooks: { PreCommit: [] } };

  const presetSettings = presetData
    .map((p) => p.settings)
    .filter((p) => existsSync(p))
    .map((p) => JSON.parse(readFileSync(p, "utf-8")));

  const mergedSettings = mergeSettings(baseSettings, presetSettings);
  const settingsDir = join(targetDir, ".claude");
  fse.ensureDirSync(settingsDir);
  writeFileSync(
    join(settingsDir, "settings.json"),
    JSON.stringify(mergedSettings, null, 2) + "\n"
  );

  // 3. Merge rules
  const baseRulesDir = join(baseDir, ".claude", "rules");
  const presetRulesDirs = presetData
    .map((p) => p.rulesDir)
    .filter((p) => existsSync(p));

  const sourceDirs = [baseRulesDir, ...presetRulesDirs].filter((d) =>
    existsSync(d)
  );
  const rulesWarnings = mergeRules(sourceDirs, join(settingsDir, "rules"));
  warnings.push(...rulesWarnings);

  // 4. Copy .gitignore
  const baseGitignore = join(baseDir, ".gitignore");
  if (existsSync(baseGitignore)) {
    fse.copySync(baseGitignore, join(targetDir, ".gitignore"));
  }

  // 5. Copy scaffold files
  for (const preset of presetData) {
    if (existsSync(preset.scaffoldDir)) {
      const files = fse.readdirSync(preset.scaffoldDir);
      for (const file of files) {
        const targetPath = join(targetDir, file);
        if (existsSync(targetPath)) {
          const conflictPath = targetPath + ".harness-conflict";
          fse.copySync(join(preset.scaffoldDir, file), conflictPath);
          warnings.push(
            `Conflict: ${file} already exists. Saved preset version as ${file}.harness-conflict`
          );
        } else {
          fse.copySync(join(preset.scaffoldDir, file), targetPath);
        }
      }
    }
  }

  // 6. Write version tracking
  const versionInfo = createVersionInfo(presets);
  writeFileSync(
    join(settingsDir, "settings.local.json"),
    JSON.stringify(versionInfo, null, 2) + "\n"
  );

  return { warnings };
}
