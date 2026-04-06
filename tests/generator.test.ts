import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import fse from "fs-extra";
import { generate } from "../cli/generator.js";

describe("generate", () => {
  let targetDir: string;

  beforeEach(() => {
    targetDir = mkdtempSync(join(tmpdir(), "harness-gen-"));
  });

  afterEach(() => {
    fse.removeSync(targetDir);
  });

  it("generates CLAUDE.md with base + preset content", () => {
    const result = generate({ targetDir, presets: ["nextjs"] });

    const claudeMd = readFileSync(join(targetDir, "CLAUDE.md"), "utf-8");
    expect(claudeMd).toContain("# Project");
    expect(claudeMd).toContain("Next.js");
    expect(result.warnings).toEqual([]);
  });

  it("generates .claude/settings.json with merged hooks", () => {
    generate({ targetDir, presets: ["nextjs"] });

    const settings = JSON.parse(
      readFileSync(join(targetDir, ".claude", "settings.json"), "utf-8")
    );
    expect(settings.hooks.PreCommit.length).toBeGreaterThan(0);
    expect(settings.hooks.PreCommit.some((h: { command: string }) => h.command.includes("eslint"))).toBe(true);
  });

  it("copies base and preset rules", () => {
    generate({ targetDir, presets: ["nextjs"] });

    const rulesDir = join(targetDir, ".claude", "rules");
    expect(existsSync(join(rulesDir, "git-workflow.md"))).toBe(true);
    expect(existsSync(join(rulesDir, "code-quality.md"))).toBe(true);
    expect(existsSync(join(rulesDir, "nextjs.md"))).toBe(true);
  });

  it("generates .gitignore from base", () => {
    generate({ targetDir, presets: ["nextjs"] });

    expect(existsSync(join(targetDir, ".gitignore"))).toBe(true);
  });

  it("handles multiple presets", () => {
    generate({ targetDir, presets: ["nextjs", "docker"] });

    const claudeMd = readFileSync(join(targetDir, "CLAUDE.md"), "utf-8");
    expect(claudeMd).toContain("Next.js");
    expect(claudeMd).toContain("Docker");
  });

  it("writes version tracking to settings.local.json", () => {
    generate({ targetDir, presets: ["nextjs", "docker"] });

    const localSettings = JSON.parse(
      readFileSync(join(targetDir, ".claude", "settings.local.json"), "utf-8")
    );
    expect(localSettings._harness.version).toBe("1.0.0");
    expect(localSettings._harness.presets).toEqual(["nextjs", "docker"]);
    expect(localSettings._harness.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
