import { resolve } from "node:path";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import fse from "fs-extra";
import { getBaseDir, loadPreset } from "../presets.js";
import { mergeClaudeMd, mergeSettings, mergeRules } from "../merge.js";
import { readVersionInfo, createVersionInfo } from "../version.js";

export async function updateCommand(opts: { yes?: boolean } = {}): Promise<void> {
  const targetDir = resolve(".");

  const versionInfo = readVersionInfo(targetDir);
  if (!versionInfo) {
    console.log(
      chalk.yellow("No harness version info found. Run `harness init` first.")
    );
    return;
  }

  console.log(
    chalk.blue(
      `Current: harness v${versionInfo.version}, presets: [${versionInfo.presets.join(", ")}]`
    )
  );
  console.log(chalk.blue(`Last updated: ${versionInfo.lastUpdated}`));

  if (!opts.yes) {
    const proceed = await confirm({
      message: "Regenerate CLAUDE.md, settings.json, and rules from latest harness?",
      default: true,
    });

    if (!proceed) {
      console.log("Cancelled.");
      return;
    }
  }

  const baseDir = getBaseDir();
  const presetData = versionInfo.presets.map((name) => loadPreset(name));

  // Regenerate CLAUDE.md
  const baseMdPath = resolve(baseDir, "CLAUDE.md");
  const presetMdPaths = presetData
    .map((p) => p.claudeMd)
    .filter((p) => existsSync(p));
  const mergedMd = mergeClaudeMd(baseMdPath, presetMdPaths);
  writeFileSync(resolve(targetDir, "CLAUDE.md"), mergedMd);
  console.log(chalk.green("✔ CLAUDE.md regenerated"));

  // Regenerate settings.json
  const baseSettingsPath = resolve(baseDir, ".claude", "settings.json");
  const baseSettings = existsSync(baseSettingsPath)
    ? JSON.parse(readFileSync(baseSettingsPath, "utf-8"))
    : { hooks: { PreCommit: [] } };
  const presetSettings = presetData
    .map((p) => p.settings)
    .filter((p) => existsSync(p))
    .map((p) => JSON.parse(readFileSync(p, "utf-8")));
  const mergedSettings = mergeSettings(baseSettings, presetSettings);
  const settingsDir = resolve(targetDir, ".claude");
  fse.ensureDirSync(settingsDir);
  writeFileSync(
    resolve(settingsDir, "settings.json"),
    JSON.stringify(mergedSettings, null, 2) + "\n"
  );
  console.log(chalk.green("✔ .claude/settings.json regenerated"));

  // Regenerate rules
  const baseRulesDir = resolve(baseDir, ".claude", "rules");
  const presetRulesDirs = presetData
    .map((p) => p.rulesDir)
    .filter((p) => existsSync(p));
  const sourceDirs = [baseRulesDir, ...presetRulesDirs].filter((d) =>
    existsSync(d)
  );
  const rulesDir = resolve(settingsDir, "rules");
  fse.emptyDirSync(rulesDir);
  const warnings = mergeRules(sourceDirs, rulesDir);
  console.log(chalk.green("✔ .claude/rules/ regenerated"));
  for (const w of warnings) {
    console.log(chalk.yellow(w));
  }

  // Update version tracking
  const newVersionInfo = createVersionInfo(versionInfo.presets);
  writeFileSync(
    resolve(settingsDir, "settings.local.json"),
    JSON.stringify(newVersionInfo, null, 2) + "\n"
  );

  console.log(chalk.green("\n✔ Update complete"));
}
