import { usePdfParse } from "../../hooks/use-pdf-parse.ts";
import { FilePicker } from "./file-picker.tsx";
import { OutputBox } from "./output-box.tsx";
import { ParseButton } from "./parse-button.tsx";

export function ParsePanel() {
  const { fileInputRef, fileName, output, selectFile, parse, isParsing } =
    usePdfParse();

  return (
    <section className="w-full rounded-card bg-surface p-6 shadow-card sm:p-12">
      <h1 className="mb-4 bg-gradient-to-r from-primary to-cyan bg-clip-text font-poster text-xxl tracking-wide text-transparent uppercase text-shadow-glow-primary sm:mb-8 sm:text-display">
        PDF to Text
      </h1>

      <div className="mb-4 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center">
        <FilePicker
          inputRef={fileInputRef}
          fileName={fileName}
          onSelect={selectFile}
        />
        <ParseButton
          onClick={parse}
          disabled={isParsing}
          aria-busy={isParsing}
        />
      </div>
      <OutputBox value={output} />
    </section>
  );
}
