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
    <label className="group flex flex-1 cursor-pointer items-center gap-2 rounded-input border-2 border-border bg-input px-4 py-3 transition-colors duration-300 hover:border-cyan hover:shadow-glow-cyan focus-within:border-cyan focus-within:shadow-glow-cyan">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={onSelect}
        aria-label="Select PDF file"
      />
      <span className="rounded-pill border border-primary bg-surface-elevated px-3 py-1 text-sm font-semibold text-primary transition duration-200 group-hover:shadow-glow-primary-soft group-hover:brightness-125 group-focus-within:shadow-glow-primary-soft group-focus-within:brightness-125">
        Browse...
      </span>
      <span className={hasFile ? "text-text" : "text-text-muted"}>
        {fileName ?? NO_FILE_TEXT}
      </span>
    </label>
  );
}
