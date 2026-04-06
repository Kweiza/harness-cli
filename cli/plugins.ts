import { homedir } from "node:os";
import { join } from "node:path";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import fse from "fs-extra";

const CLAUDE_SETTINGS_PATH = join(homedir(), ".claude", "settings.json");

const KWEIZA_MARKETPLACE = {
  source: {
    source: "github",
    repo: "kweiza/skills",
  },
};

const KWEIZA_PLUGINS: Record<string, boolean> = {
  "grafik-bar@kweiza-skills": true,
  "harness@kweiza-skills": true,
};

const MARKETPLACE_KEY = "kweiza-skills";

interface ClaudeSettings {
  enabledPlugins?: Record<string, boolean>;
  extraKnownMarketplaces?: Record<string, unknown>;
  [key: string]: unknown;
}

export function hasKweizaPlugins(): boolean {
  if (!existsSync(CLAUDE_SETTINGS_PATH)) return false;
  const settings: ClaudeSettings = JSON.parse(readFileSync(CLAUDE_SETTINGS_PATH, "utf-8"));
  const plugins = settings.enabledPlugins ?? {};
  return Object.keys(KWEIZA_PLUGINS).every((name) => name in plugins);
}

export function installKweizaPlugins(): { installed: string[]; alreadyInstalled: string[] } {
  const installed: string[] = [];
  const alreadyInstalled: string[] = [];

  // Read current settings
  let settings: ClaudeSettings = {};
  if (existsSync(CLAUDE_SETTINGS_PATH)) {
    settings = JSON.parse(readFileSync(CLAUDE_SETTINGS_PATH, "utf-8"));
  }

  // Ensure extraKnownMarketplaces
  if (!settings.extraKnownMarketplaces) {
    settings.extraKnownMarketplaces = {};
  }

  // Add kweiza marketplace if not present
  if (!(MARKETPLACE_KEY in settings.extraKnownMarketplaces)) {
    settings.extraKnownMarketplaces[MARKETPLACE_KEY] = KWEIZA_MARKETPLACE;
  }

  // Ensure enabledPlugins
  if (!settings.enabledPlugins) {
    settings.enabledPlugins = {};
  }

  // Add plugins
  for (const [pluginName, enabled] of Object.entries(KWEIZA_PLUGINS)) {
    if (pluginName in settings.enabledPlugins) {
      alreadyInstalled.push(pluginName);
    } else {
      settings.enabledPlugins[pluginName] = enabled;
      installed.push(pluginName);
    }
  }

  // Write back
  fse.ensureDirSync(join(homedir(), ".claude"));
  writeFileSync(CLAUDE_SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");

  return { installed, alreadyInstalled };
}
