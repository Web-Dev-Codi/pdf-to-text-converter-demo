interface ParseButtonProps {
  onClick: () => void;
  disabled?: boolean;
  "aria-busy"?: boolean;
}

export function ParseButton({
  onClick,
  disabled = false,
  ...rest
}: ParseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className="w-full rounded-input bg-primary px-8 py-3 text-base font-semibold text-on-primary transition duration-200 shadow-glow-primary-soft hover:-translate-y-0.5 hover:brightness-110 hover:shadow-glow-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100 disabled:hover:shadow-none sm:w-auto"
    >
      {disabled ? "Parsing..." : "Parse PDF"}
    </button>
  );
}
