export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

export class PdfValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfValidationError";
  }
}

export interface ParsedPage {
  pageNumber: number;
  text: string;
}

export interface PdfParseResult {
  fileName: string;
  totalPages: number;
  text: string;
  pages: ParsedPage[];
}

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
      pages: result.pages.map((page) => ({
        pageNumber: page.num,
        text: page.text ?? "",
      })),
    };
  } finally {
    await parser.destroy();
  }
}
