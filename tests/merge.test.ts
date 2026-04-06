import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import fse from "fs-extra";
import { mergeClaudeMd, mergeSettings, mergeRules } from "../cli/merge.js";

describe("mergeClaudeMd", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "harness-test-"));
  });

  afterEach(() => {
    fse.removeSync(tempDir);
  });

  it("merges base and preset CLAUDE.md files", () => {
    const baseMd = join(tempDir, "base.md");
    const presetMd = join(tempDir, "preset.md");
    writeFileSync(baseMd, "# Project\n\n## Build & Run\n");
    writeFileSync(presetMd, "## Next.js\n\n### Build\n- npm run dev\n");

    const result = mergeClaudeMd(baseMd, [presetMd]);
    expect(result).toContain("# Project");
    expect(result).toContain("## Next.js");
    expect(result).toContain("npm run dev");
  });

  it("merges multiple presets with separators", () => {
    const baseMd = join(tempDir, "base.md");
    const preset1 = join(tempDir, "p1.md");
    const preset2 = join(tempDir, "p2.md");
    writeFileSync(baseMd, "# Project\n");
    writeFileSync(preset1, "## Next.js\n");
    writeFileSync(preset2, "## FastAPI\n");

    const result = mergeClaudeMd(baseMd, [preset1, preset2]);
    expect(result).toContain("# Project");
    expect(result).toContain("## Next.js");
    expect(result).toContain("## FastAPI");
  });

  it("returns warning when result exceeds 200 lines", () => {
    const baseMd = join(tempDir, "base.md");
    const presetMd = join(tempDir, "preset.md");
    writeFileSync(baseMd, "# Project\n" + "line\n".repeat(200));
    writeFileSync(presetMd, "## Preset\n");

    const result = mergeClaudeMd(baseMd, [presetMd]);
    expect(result.split("\n").length).toBeGreaterThan(200);
  });
});

describe("mergeSettings", () => {
  it("merges hooks from base and presets", () => {
    const base = { hooks: { PreCommit: [] } };
    const preset1 = {
      hooks: { PreCommit: [{ command: "npx eslint --fix ." }] },
    };
    const preset2 = {
      hooks: { PreCommit: [{ command: "npx prettier --check ." }] },
    };

    const result = mergeSettings(base, [preset1, preset2]);
    expect(result.hooks.PreCommit).toHaveLength(2);
    expect(result.hooks.PreCommit[0].command).toBe("npx eslint --fix .");
    expect(result.hooks.PreCommit[1].command).toBe("npx prettier --check .");
  });

  it("deduplicates hooks with same command", () => {
    const base = { hooks: { PreCommit: [] } };
    const preset1 = {
      hooks: { PreCommit: [{ command: "npx eslint --fix ." }] },
    };
    const preset2 = {
      hooks: { PreCommit: [{ command: "npx eslint --fix ." }] },
    };

    const result = mergeSettings(base, [preset1, preset2]);
    expect(result.hooks.PreCommit).toHaveLength(1);
  });
});

describe("mergeRules", () => {
  let tempDir: string;
  let targetDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "harness-test-"));
    targetDir = join(tempDir, "target", ".claude", "rules");
  });

  afterEach(() => {
    fse.removeSync(tempDir);
  });

  it("copies base and preset rules to target", () => {
    const baseRulesDir = join(tempDir, "base-rules");
    const presetRulesDir = join(tempDir, "preset-rules");
    mkdirSync(baseRulesDir, { recursive: true });
    mkdirSync(presetRulesDir, { recursive: true });
    writeFileSync(join(baseRulesDir, "git.md"), "# Git rules");
    writeFileSync(join(presetRulesDir, "nextjs.md"), "# Next.js rules");

    const warnings = mergeRules([baseRulesDir, presetRulesDir], targetDir);
    expect(existsSync(join(targetDir, "git.md"))).toBe(true);
    expect(existsSync(join(targetDir, "nextjs.md"))).toBe(true);
    expect(warnings).toHaveLength(0);
  });

  it("warns when total rule files exceed 20", () => {
    const rulesDir = join(tempDir, "many-rules");
    mkdirSync(rulesDir, { recursive: true });
    for (let i = 0; i < 21; i++) {
      writeFileSync(join(rulesDir, `rule-${i}.md`), `# Rule ${i}`);
    }

    const warnings = mergeRules([rulesDir], targetDir);
    expect(warnings.some((w) => w.includes("20"))).toBe(true);
  });
});
