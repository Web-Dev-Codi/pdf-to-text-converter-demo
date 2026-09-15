import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/app.ts";

const fixturePath = join(__dirname, "fixtures", "pdf-1.7.pdf");
const fixtureBytes = readFileSync(fixturePath);

describe("POST /api/v1/pdf/parse", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns 200 with parsed pages for a valid PDF", async () => {
    const response = await request(app)
      .post("/api/v1/pdf/parse")
      .attach("file", fixtureBytes, {
        filename: "pdf-1.7.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(200);
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.fileName).toBe("pdf-1.7.pdf");
    expect(response.body.data.totalPages).toBe(1);
    expect(response.body.data.pages).toHaveLength(1);
    expect(response.body.data.pages[0].text).toContain("Hello PDF");
  });

  it("returns 400 invalid_request when no file is attached", async () => {
    const response = await request(app).post("/api/v1/pdf/parse");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("invalid_request");
  });

  it.each(
    readdirSync(join(__dirname, "fixtures")).filter((f) =>
      /^pdf-\d\.\d\.pdf$/.test(f),
    ),
  )("accepts every supported spec version over HTTP (%s)", async (fixture) => {
    const version = fixture.replace(/^pdf-|\.pdf$/g, "");
    const response = await request(app)
      .post("/api/v1/pdf/parse")
      .attach("file", readFileSync(join(__dirname, "fixtures", fixture)), {
        filename: fixture,
        contentType: "application/pdf",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.totalPages).toBe(1);
    expect(response.body.data.pages[0].text).toContain(`Hello PDF v${version}`);
  });

  it("returns 415 unsupported_media_type for non-PDF uploads", async () => {
    const response = await request(app)
      .post("/api/v1/pdf/parse")
      .attach("file", Buffer.from("plain text, not a pdf"), {
        filename: "notes.txt",
        contentType: "text/plain",
      });

    expect(response.status).toBe(415);
    expect(response.body.error.code).toBe("unsupported_media_type");
  });

  it("returns 413 payload_too_large for oversized uploads", async () => {
    const oversized = Buffer.concat([
      Buffer.from("%PDF-1.4\n"),
      Buffer.alloc(10 * 1024 * 1024 + 1, 0x41),
    ]);
    const response = await request(app)
      .post("/api/v1/pdf/parse")
      .attach("file", oversized, {
        filename: "big.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe("payload_too_large");
  });
});
