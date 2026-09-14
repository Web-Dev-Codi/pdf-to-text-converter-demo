import { usePdfParse } from "../../hooks/use-pdf-parse.ts";
import { FilePicker } from "./file-picker.tsx";
import { OutputBox } from "./output-box.tsx";
import { ParseButton } from "./parse-button.tsx";

export function ParsePanel() {
  const { fileInputRef, fileName, output, selectFile, parse, isParsing } = usePdfParse();

  return (
    <section className="w-full rounded-card bg-surface p-12 shadow-card">
      <h1 className="mb-8 font-poster text-4xl tracking-wide text-text uppercase">
        PDF to Text
      </h1>

      <div className="mb-8 flex items-center gap-4">
        <FilePicker
          inputRef={fileInputRef}
          fileName={fileName}
          onSelect={selectFile}
        />
        <ParseButton onClick={parse} disabled={isParsing} />
      </div>
      <OutputBox value={output} />
    </section>
  );
}
