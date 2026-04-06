import chalk from "chalk";
import { getPresetList } from "../presets.js";

export function listCommand(): void {
  const presets = getPresetList();
  console.log("\nAvailable presets:\n");

  for (const preset of presets) {
    const name = preset.name.padEnd(24);
    console.log(`  ${chalk.cyan(name)}${preset.description}`);
  }

  console.log("");
}
