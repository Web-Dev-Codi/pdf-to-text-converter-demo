interface ParseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ParseButton({ onClick, disabled = false }: ParseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-input bg-primary px-8 py-3 text-base font-semibold text-on-primary transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
    >
      {disabled ? "Parsing..." : "Parse PDF"}
    </button>
  );
}
