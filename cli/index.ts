#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

program
  .name("harness")
  .description("Kweiza Harness — Claude Code project setup CLI")
  .version("1.0.0");

program
  .command("init [path]")
  .description("Initialize a new project with harness standards")
  .option("-y, --yes", "Non-interactive mode (skip all prompts)")
  .option("--presets <presets>", "Comma-separated preset names (e.g. nextjs,docker)")
  .option("--no-git-init", "Skip git initialization")
  .option("--no-plugins", "Skip Kweiza plugins installation")
  .action(async (path: string | undefined, opts: { yes?: boolean; presets?: string; gitInit?: boolean; plugins?: boolean }) => {
    await initCommand(path, opts);
  });

program
  .command("add <preset>")
  .description("Add a preset to an existing project")
  .option("-y, --yes", "Non-interactive mode (skip all prompts)")
  .action(async (preset: string, opts: { yes?: boolean }) => {
    await addCommand(preset, opts);
  });

program
  .command("list")
  .description("List available presets")
  .action(() => {
    listCommand();
  });

program
  .command("update")
  .description("Sync project with latest harness standards")
  .option("-y, --yes", "Non-interactive mode (skip all prompts)")
  .action(async (opts: { yes?: boolean }) => {
    await updateCommand(opts);
  });

program.parse();
