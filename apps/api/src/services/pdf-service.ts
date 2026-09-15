import type {
  ParsedPage,
  PdfParseResult,
} from "@pdf-to-text-converter-demo/shared-types";

/** Largest upload the API accepts: 10 MB. */
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Thrown by `validatePdfUpload` when an uploaded file is empty, oversized,
 * or not a PDF. Message text is user-facing (the controller maps it 1:1
 * into the API error envelope).
 */
export class PdfValidationError extends Error {
  /** True when the failure is specifically about the file size limit. */
  readonly isSize: boolean;

  constructor(message: string, isSize = false) {
    super(message);
    this.name = "PdfValidationError";
    this.isSize = isSize;
  }
}

/**
 * Extracts text from a PDF buffer, page by page.
 *
 * Dynamically imports `pdf-parse` so its wasm/pdfium payload is only loaded
 * when an actual parse happens. Always destroys the parser, even on failure.
 *
 * @param buffer - Raw bytes of the uploaded PDF file.
 * @returns The parse result; `fileName` is left empty for the controller to stamp.
 * @throws {PdfValidationError} Never thrown directly, but callers should expect
 * `PdfValidationError`-shaped failures upstream (validation) and parse failures here.
 */
export async function extractPdfText(buffer: Buffer): Promise<PdfParseResult> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText({
      lineEnforce: true,
      lineThreshold: 4.0,
      cellSeparator: "\t",
      cellThreshold: 7,
    });
    return {
      fileName: "",
      totalPages: result.total,
      text: result.text ?? "",
      pages: result.pages.map(
        (page): ParsedPage => ({
          pageNumber: page.num,
          text: page.text ?? "",
        }),
      ),
    };
  } finally {
    await parser.destroy();
  }
}
