import { resolve } from "node:path";
import { execSync } from "node:child_process";
import chalk from "chalk";
import fse from "fs-extra";
import { promptInit } from "../prompts.js";
import { generate } from "../generator.js";
import { readVersionInfo } from "../version.js";

export async function initCommand(targetPath?: string): Promise<void> {
  const answers = await promptInit();
  const targetDir = resolve(targetPath ?? answers.projectName);

  // Check if already initialized
  const existingVersion = readVersionInfo(targetDir);
  if (existingVersion) {
    console.log(
      chalk.yellow(
        `This project already has harness v${existingVersion.version} applied.`
      )
    );
    console.log("Use `harness add <preset>` or `harness update` instead.");
    return;
  }

  // Create target directory
  fse.ensureDirSync(targetDir);

  // Generate files
  const result = generate({
    targetDir,
    presets: answers.presets,
  });

  console.log(chalk.green("✔ Base standards applied"));
  for (const preset of answers.presets) {
    console.log(chalk.green(`✔ presets/${preset}/ applied`));
  }

  // Warnings
  for (const warning of result.warnings) {
    console.log(chalk.yellow(warning));
  }

  // Git init
  if (answers.gitInit) {
    try {
      execSync("git init", { cwd: targetDir, stdio: "pipe" });
      execSync("git add -A", { cwd: targetDir, stdio: "pipe" });
      execSync('git commit -m "chore: initial kweiza harness setup"', {
        cwd: targetDir,
        stdio: "pipe",
      });
      console.log(chalk.green("✔ git init + initial commit"));
    } catch {
      console.log(chalk.yellow("Warning: git init failed. Skipping."));
    }
  }

  console.log(chalk.green(`\n🎉 Done! Project ready at ${targetDir}`));
}
