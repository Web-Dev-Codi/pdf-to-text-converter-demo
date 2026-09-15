import { describe, expect, it } from "vitest";
import {
  MAX_UPLOAD_SIZE_BYTES,
  PdfValidationError,
} from "../src/services/pdf-service.ts";
import { validatePdfUpload } from "../src/utils/pdf-uploads.ts";

/** Builds a buffer that starts with valid PDF magic bytes. */
function pdfBuffer(sizeBytes: number): Buffer {
  const head = Buffer.from("%PDF-1.4\n");
  return Buffer.concat([
    head,
    Buffer.alloc(Math.max(0, sizeBytes - head.length), 0x41),
  ]);
}

describe("validatePdfUpload", () => {
  it("accepts a valid non-empty PDF buffer", () => {
    expect(() => validatePdfUpload(pdfBuffer(1024))).not.toThrow();
  });

  it("accepts a buffer exactly at the size limit", () => {
    expect(() =>
      validatePdfUpload(pdfBuffer(MAX_UPLOAD_SIZE_BYTES)),
    ).not.toThrow();
  });

  it("throws for an empty buffer", () => {
    expect(() => validatePdfUpload(Buffer.alloc(0))).toThrow(
      PdfValidationError,
    );
    expect(() => validatePdfUpload(Buffer.alloc(0))).toThrow(/empty/);
  });

  it("throws for a buffer exceeding the 10MB limit", () => {
    expect(() =>
      validatePdfUpload(pdfBuffer(MAX_UPLOAD_SIZE_BYTES + 1)),
    ).toThrow(/exceeds/);
  });

  it("throws for a file without PDF magic bytes", () => {
    const notPdf = Buffer.from("just some text, definitely not a pdf");
    expect(() => validatePdfUpload(notPdf)).toThrow(/not a valid PDF/);
  });
});
