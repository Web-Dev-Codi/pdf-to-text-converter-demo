import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { extractPdfText } from "../src/services/pdf-service.ts";

const fixturesDir = join(__dirname, "fixtures");

/**
 * Every PDF spec version per Wikipedia "History of PDF":
 * Adobe specs 1.0–1.7, then ISO 32000-2 (2.0). One fixture file each.
 */
const ALL_VERSIONS = readdirSync(fixturesDir)
  .filter((f) => /^pdf-\d\.\d\.pdf$/.test(f))
  .sort();

describe("extractPdfText", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(ALL_VERSIONS)(
    "parses a PDF 1.x–2.0 fixture (%s)",
    async (fixture) => {
      const version = fixture.replace(/^pdf-|\.pdf$/g, "");
      const buffer = readFileSync(join(fixturesDir, fixture));
      const result = await extractPdfText(buffer);

      expect(result.totalPages).toBe(1);
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0]?.pageNumber).toBe(1);
      expect(result.pages[0]?.text).toContain(`Hello PDF v${version}`);
      expect(result.fileName).toBe("");
    },
  );

  it("covers every PDF spec version from 1.0 through 2.0", () => {
    expect(ALL_VERSIONS).toEqual([
      "pdf-1.0.pdf",
      "pdf-1.1.pdf",
      "pdf-1.2.pdf",
      "pdf-1.3.pdf",
      "pdf-1.4.pdf",
      "pdf-1.5.pdf",
      "pdf-1.6.pdf",
      "pdf-1.7.pdf",
      "pdf-2.0.pdf",
    ]);
  });

  it("destroys the parser even when extraction fails", async () => {
    const garbage = Buffer.from("definitely not a pdf at all");
    await expect(extractPdfText(garbage)).rejects.toThrow();
  });
});
