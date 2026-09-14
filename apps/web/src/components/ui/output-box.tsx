interface OutputBoxProps {
  value: string;
}

export function OutputBox({ value }: OutputBoxProps) {
  return (
    <>
      <h2 className="mb-4 border-b-2 border-border pb-2 text-2xl font-bold">
        Output
      </h2>
      <output className="block max-h-[70vh] overflow-auto rounded-input border border-border bg-input p-6 font-mono text-sm leading-normal whitespace-pre-wrap text-text">
        {value}
      </output>
    </>
  );
}
