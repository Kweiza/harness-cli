import { resolve } from "node:path";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import chalk from "chalk";
import fse from "fs-extra";
import { loadPreset } from "../presets.js";
import { mergeClaudeMd, mergeSettings, mergeRules } from "../merge.js";
import { readVersionInfo, createVersionInfo } from "../version.js";
import { installKweizaPlugins } from "../plugins.js";

export async function addCommand(presetName: string): Promise<void> {
  const targetDir = resolve(".");

  // Validate preset
  let presetPaths;
  try {
    presetPaths = loadPreset(presetName);
  } catch {
    console.log(chalk.red(`Unknown preset: ${presetName}`));
    console.log("Run `harness list` to see available presets.");
    return;
  }

  // Check if already has this preset
  const versionInfo = readVersionInfo(targetDir);
  if (versionInfo?.presets.includes(presetName)) {
    console.log(chalk.yellow(`Preset "${presetName}" is already applied.`));
    return;
  }

  // Merge CLAUDE.md
  const claudeMdPath = resolve(targetDir, "CLAUDE.md");
  if (existsSync(claudeMdPath) && existsSync(presetPaths.claudeMd)) {
    const merged = mergeClaudeMd(claudeMdPath, [presetPaths.claudeMd]);
    writeFileSync(claudeMdPath, merged);
    console.log(chalk.green(`✔ CLAUDE.md updated with ${presetName} section`));
  }

  // Merge settings.json
  const settingsPath = resolve(targetDir, ".claude", "settings.json");
  if (existsSync(settingsPath) && existsSync(presetPaths.settings)) {
    const currentSettings = JSON.parse(readFileSync(settingsPath, "utf-8"));
    const presetSettings = JSON.parse(
      readFileSync(presetPaths.settings, "utf-8")
    );
    const merged = mergeSettings(currentSettings, [presetSettings]);
    writeFileSync(settingsPath, JSON.stringify(merged, null, 2) + "\n");
    console.log(chalk.green(`✔ .claude/settings.json hooks updated`));
  }

  // Copy rules
  const targetRulesDir = resolve(targetDir, ".claude", "rules");
  if (existsSync(presetPaths.rulesDir)) {
    const warnings = mergeRules([presetPaths.rulesDir], targetRulesDir);
    console.log(chalk.green(`✔ .claude/rules/ updated`));
    for (const w of warnings) {
      console.log(chalk.yellow(w));
    }
  }

  // Copy scaffold
  if (existsSync(presetPaths.scaffoldDir)) {
    const files = fse.readdirSync(presetPaths.scaffoldDir);
    for (const file of files) {
      const targetPath = resolve(targetDir, file);
      if (existsSync(targetPath)) {
        console.log(
          chalk.yellow(`Skipped ${file} (already exists)`)
        );
      } else {
        fse.copySync(resolve(presetPaths.scaffoldDir, file), targetPath);
        console.log(chalk.green(`✔ ${file} created`));
      }
    }
  }

  // Ensure Kweiza plugins are configured
  const { installed } = installKweizaPlugins();
  if (installed.length > 0) {
    console.log(chalk.green(`✔ Kweiza plugins configured: ${installed.join(", ")}`));
  }

  // Update version tracking
  const updatedPresets = [...(versionInfo?.presets ?? []), presetName];
  const newVersionInfo = createVersionInfo(updatedPresets);
  const localSettingsPath = resolve(targetDir, ".claude", "settings.local.json");
  writeFileSync(localSettingsPath, JSON.stringify(newVersionInfo, null, 2) + "\n");
}
