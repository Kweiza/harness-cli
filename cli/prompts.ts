import { input, checkbox, confirm } from "@inquirer/prompts";
import { getPresetList } from "./presets.js";

export interface InitAnswers {
  projectName: string;
  presets: string[];
  gitInit: boolean;
}

export async function promptInit(): Promise<InitAnswers> {
  const presetList = getPresetList();

  const projectName = await input({
    message: "Project name:",
    default: "my-app",
  });

  const presets = await checkbox({
    message: "Select presets (space to toggle, enter to confirm):",
    choices: presetList.map((p) => ({
      name: `${p.label} — ${p.description}`,
      value: p.name,
    })),
  });

  if (presets.length === 0) {
    console.log("No presets selected. Base standards will still be applied.");
  }

  const gitInit = await confirm({
    message: "Initialize git?",
    default: true,
  });

  return { projectName, presets, gitInit };
}
