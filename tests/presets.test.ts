import { describe, it, expect } from "vitest";
import { getPresetList, loadPreset, getPresetDir } from "../cli/presets.js";

describe("presets", () => {
  it("returns all available presets", () => {
    const presets = getPresetList();
    expect(presets).toHaveLength(9);
    expect(presets.map((p) => p.name)).toContain("nextjs");
    expect(presets.map((p) => p.name)).toContain("fastapi");
    expect(presets.map((p) => p.name)).toContain("docker");
  });

  it("each preset has name, label, and description", () => {
    const presets = getPresetList();
    for (const preset of presets) {
      expect(preset.name).toBeTruthy();
      expect(preset.label).toBeTruthy();
      expect(preset.description).toBeTruthy();
    }
  });

  it("loadPreset returns paths for existing preset", () => {
    const preset = loadPreset("nextjs");
    expect(preset.claudeMd).toContain("CLAUDE.md");
    expect(preset.settings).toContain("settings.json");
    expect(preset.rulesDir).toContain("rules");
  });

  it("loadPreset throws for unknown preset", () => {
    expect(() => loadPreset("nonexistent")).toThrow("Unknown preset");
  });

  it("getPresetDir returns correct directory", () => {
    const dir = getPresetDir("nextjs");
    expect(dir).toMatch(/presets\/nextjs$/);
  });
});
