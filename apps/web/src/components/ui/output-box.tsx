interface OutputBoxProps {
  value: string;
}

export function OutputBox({ value }: OutputBoxProps) {
  return (
    <>
      <h2 className="mb-2 border-b-2 border-border pb-2 text-xxl font-bold text-text uppercase tracking-wide sm:mb-4">
        Output
      </h2>
      <output className="block max-h-(--scroll-max-output) overflow-auto rounded-input border border-border bg-input p-4 font-mono text-sm leading-normal whitespace-pre-wrap text-text sm:p-6">
        {value}
      </output>
    </>
  );
}
