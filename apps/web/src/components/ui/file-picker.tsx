import type { RefObject } from "react";

interface FilePickerProps {
  inputRef: RefObject<HTMLInputElement | null>;
  fileName: string | null;
  onSelect: () => void;
}

const NO_FILE_TEXT = "No file selected.";

export function FilePicker({ inputRef, fileName, onSelect }: FilePickerProps) {
  const hasFile = fileName !== null;

  return (
    <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-input border-2 border-border bg-input px-4 py-3 transition-colors duration-300 hover:border-primary focus-within:border-primary">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={onSelect}
      />
      <span className="rounded-pill border border-border bg-surface-elevated px-3 py-1 text-sm font-semibold">
        Browse...
      </span>
      <span className={hasFile ? "text-text" : "text-text-muted"}>
        {fileName ?? NO_FILE_TEXT}
      </span>
    </label>
  );
}
