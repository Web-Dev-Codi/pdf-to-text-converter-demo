import { useCallback, useRef, useState } from "react";
import {
  formatPages,
  PdfApiError,
  PdfNetworkError,
  parsePdfText,
} from "../lib/parse-pdf.ts";

const IDLE_OUTPUT_TEXT =
  'Please select a PDF file under 10MB and click "Parse PDF".';
const NO_FILE_MESSAGE = "Please select a PDF file first.";

export function usePdfParse() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string>(IDLE_OUTPUT_TEXT);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = useCallback(() => {
    const selected = fileInputRef.current?.files?.[0] ?? null;
    setFile(selected);
    setFileName(selected ? selected.name : null);
  }, []);

  const parse = useCallback(async () => {
    if (!file) {
      setOutput(NO_FILE_MESSAGE);
      return;
    }

    setIsParsing(true);
    setOutput("Reading and parsing...");

    try {
      const result = await parsePdfText(file);
      setOutput(
        formatPages(result.pages, result.totalPages) ||
          "(no text content found in this PDF)",
      );
    } catch (error) {
      if (error instanceof PdfApiError || error instanceof PdfNetworkError) {
        setOutput(error.message);
        return;
      }
      setOutput("Something went wrong.");
    } finally {
      setIsParsing(false);
    }
  }, [file]);

  return { fileInputRef, fileName, output, selectFile, parse, isParsing };
}
