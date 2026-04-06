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
  .action(async (path?: string) => {
    await initCommand(path);
  });

program
  .command("add <preset>")
  .description("Add a preset to an existing project")
  .action(async (preset: string) => {
    await addCommand(preset);
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
  .action(async () => {
    await updateCommand();
  });

program.parse();
