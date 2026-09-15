import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatPages,
  PdfApiError,
  PdfNetworkError,
  parsePdfText,
} from "./parse-pdf.ts";

describe("formatPages", () => {
  it("renders page headers and joins pages with blank lines", () => {
    const output = formatPages(
      [
        { pageNumber: 1, text: "first" },
        { pageNumber: 2, text: "second" },
      ],
      2,
    );
    expect(output).toContain("── Page 1 of 2 ──");
    expect(output).toContain("first");
    expect(output).toContain("── Page 2 of 2 ──");
    expect(output).toContain("second");
  });

  it("expands tabs and trims page text", () => {
    const output = formatPages([{ pageNumber: 1, text: "\ta\tb\n" }], 1);
    expect(output).toContain("a    b");
    expect(output.endsWith("\n")).toBe(false);
  });
});

describe("parsePdfText", () => {
  const file = new File(["%PDF-"], "doc.pdf", { type: "application/pdf" });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeFetchResponse(
    status: number,
    payload: unknown,
    ok = status < 400,
  ): Response {
    return {
      ok,
      status,
      json: () => Promise.resolve(payload),
    } as unknown as Response;
  }

  it("posts the file as multipart form data and returns parsed result", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      makeFetchResponse(200, {
        data: {
          fileName: "doc.pdf",
          totalPages: 1,
          pages: [{ pageNumber: 1, text: "hi" }],
        },
      }),
    );

    const result = await parsePdfText(file, { fetcher, apiUrl: "http://test" });

    expect(fetcher).toHaveBeenCalledWith("http://test/api/v1/pdf/parse", {
      method: "POST",
      body: expect.any(FormData),
    });
    expect(result.fileName).toBe("doc.pdf");
    expect(result.pages).toHaveLength(1);
  });

  it("throws PdfApiError with the API's code and message on error responses", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      makeFetchResponse(415, {
        error: { code: "unsupported_media_type", message: "Not a PDF." },
      }),
    );

    const error = await parsePdfText(file, {
      fetcher,
      apiUrl: "http://test",
    }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PdfApiError);
    expect((error as PdfApiError).code).toBe("unsupported_media_type");
    expect((error as PdfApiError).message).toBe("Not a PDF.");
  });

  it("falls back to unknown_error when the error envelope is missing", async () => {
    const fetcher = vi.fn().mockResolvedValue(makeFetchResponse(500, {}));

    const error = await parsePdfText(file, {
      fetcher,
      apiUrl: "http://test",
    }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PdfApiError);
    expect((error as PdfApiError).code).toBe("unknown_error");
  });

  it("throws PdfNetworkError when fetch itself fails", async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError("network down"));

    await expect(
      parsePdfText(file, { fetcher, apiUrl: "http://test" }),
    ).rejects.toBeInstanceOf(PdfNetworkError);
  });
});
