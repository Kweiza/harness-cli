import { input, checkbox, confirm } from "@inquirer/prompts";
import { getPresetList } from "./presets.js";
import { hasKweizaPlugins } from "./plugins.js";

export interface InitAnswers {
  projectName: string;
  presets: string[];
  gitInit: boolean;
  installPlugins: boolean;
}

export interface InitOptions {
  yes?: boolean;
  presets?: string;
  gitInit?: boolean;
  plugins?: boolean;
}

export async function promptInit(opts: InitOptions = {}): Promise<InitAnswers> {
  // Non-interactive mode: use flags or defaults
  if (opts.yes) {
    const presetNames = opts.presets
      ? opts.presets.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    // Validate preset names
    const validNames = getPresetList().map((p) => p.name);
    for (const name of presetNames) {
      if (!validNames.includes(name)) {
        throw new Error(`Unknown preset: ${name}. Available: ${validNames.join(", ")}`);
      }
    }

    if (presetNames.length === 0) {
      console.log("No presets selected. Base standards will still be applied.");
    }

    return {
      projectName: "my-app",
      presets: presetNames,
      gitInit: opts.gitInit !== false,
      installPlugins: opts.plugins !== false && !hasKweizaPlugins(),
    };
  }

  // Interactive mode (existing behavior)
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

  const installPlugins = hasKweizaPlugins()
    ? false
    : await confirm({
        message: "Install Kweiza plugins? (recommended — grafik-bar status line)",
        default: true,
      });

  return { projectName, presets, gitInit, installPlugins };
}
