import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import fse from "fs-extra";
import { generate } from "../cli/generator.js";

describe("e2e: generate full project", () => {
  let targetDir: string;

  beforeEach(() => {
    targetDir = mkdtempSync(join(tmpdir(), "harness-e2e-"));
  });

  afterEach(() => {
    fse.removeSync(targetDir);
  });

  it("generates complete nextjs + docker project", () => {
    const result = generate({ targetDir, presets: ["nextjs", "docker"] });

    // CLAUDE.md exists and has both sections
    const claudeMd = readFileSync(join(targetDir, "CLAUDE.md"), "utf-8");
    expect(claudeMd).toContain("# Project");
    expect(claudeMd).toContain("Next.js");
    expect(claudeMd).toContain("Docker");

    // settings.json has nextjs hooks
    const settings = JSON.parse(
      readFileSync(join(targetDir, ".claude", "settings.json"), "utf-8")
    );
    expect(settings.hooks.PreCommit.some((h: { command: string }) => h.command.includes("eslint"))).toBe(
      true
    );

    // Rules: base (5) + nextjs (1) + docker (1) = 7
    const rules = readdirSync(join(targetDir, ".claude", "rules"));
    expect(rules.length).toBe(7);
    expect(rules).toContain("git-workflow.md");
    expect(rules).toContain("nextjs.md");
    expect(rules).toContain("docker.md");

    // .gitignore exists
    expect(existsSync(join(targetDir, ".gitignore"))).toBe(true);

    // Version tracking
    const localSettings = JSON.parse(
      readFileSync(join(targetDir, ".claude", "settings.local.json"), "utf-8")
    );
    expect(localSettings._harness.presets).toEqual(["nextjs", "docker"]);

    // No warnings for this combo
    expect(result.warnings).toEqual([]);
  });

  it("generates complete fastapi + ai-agent project", () => {
    const result = generate({ targetDir, presets: ["fastapi", "ai-agent"] });

    const claudeMd = readFileSync(join(targetDir, "CLAUDE.md"), "utf-8");
    expect(claudeMd).toContain("FastAPI");
    expect(claudeMd).toContain("AI Agent");

    // Hooks are deduplicated (both use ruff)
    const settings = JSON.parse(
      readFileSync(join(targetDir, ".claude", "settings.json"), "utf-8")
    );
    const ruffCheckHooks = settings.hooks.PreCommit.filter(
      (h: { command: string }) => h.command === "uv run ruff check --fix ."
    );
    expect(ruffCheckHooks).toHaveLength(1);
  });

  it("generates all 9 presets without error", () => {
    const allPresets = [
      "nextjs", "vite", "fastapi", "express",
      "figma-plugin", "ai-agent", "comfyui",
      "fullstack-platform", "docker",
    ];

    const result = generate({ targetDir, presets: allPresets });

    expect(existsSync(join(targetDir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(join(targetDir, ".claude", "settings.json"))).toBe(true);

    const rules = readdirSync(join(targetDir, ".claude", "rules"));
    // base (5) + 9 presets (1 each) = 14, under 20 rule file limit
    expect(rules.length).toBe(14);
    expect(result.warnings.some((w) => w.includes("rule files exceed"))).toBe(false);
    // CLAUDE.md will exceed 200 lines when all 9 presets combined — that's expected
    expect(result.warnings.some((w) => w.includes("CLAUDE.md"))).toBe(true);
  });

  it("base-only project (no presets) works", () => {
    const result = generate({ targetDir, presets: [] });

    const claudeMd = readFileSync(join(targetDir, "CLAUDE.md"), "utf-8");
    expect(claudeMd).toContain("# Project");

    const rules = readdirSync(join(targetDir, ".claude", "rules"));
    expect(rules.length).toBe(5);

    expect(result.warnings).toEqual([]);
  });

  it("preserves existing CLAUDE.md instead of overwriting with base template", () => {
    // Simulate a project that already has a CLAUDE.md
    const existingContent = "# My Existing Project\n\nCustom build instructions here.\n";
    writeFileSync(join(targetDir, "CLAUDE.md"), existingContent);

    const result = generate({ targetDir, presets: ["nextjs"] });

    const claudeMd = readFileSync(join(targetDir, "CLAUDE.md"), "utf-8");
    // Should contain the original content
    expect(claudeMd).toContain("# My Existing Project");
    expect(claudeMd).toContain("Custom build instructions here.");
    // Should also contain the preset section
    expect(claudeMd).toContain("Next.js");
    // Should NOT contain the base template placeholder
    expect(claudeMd).not.toContain("<!-- Populated by presets -->");

    expect(result.warnings).toEqual([]);
  });

  it("preserves existing CLAUDE.md with no presets selected", () => {
    const existingContent = "# My Project\n\nImportant notes.\n";
    writeFileSync(join(targetDir, "CLAUDE.md"), existingContent);

    generate({ targetDir, presets: [] });

    const claudeMd = readFileSync(join(targetDir, "CLAUDE.md"), "utf-8");
    expect(claudeMd).toContain("# My Project");
    expect(claudeMd).toContain("Important notes.");
  });
});
