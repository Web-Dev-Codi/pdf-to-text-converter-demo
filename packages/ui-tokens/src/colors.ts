export interface Colors {
  surface: string;
  "surface-elevated": string;
  input: string;
  border: string;
  primary: string;
  "on-primary": string;
  text: string;
  "text-muted": string;
}

export const palette = {
  dark: {
    surface: "#1c1c1e",
    "surface-elevated": "#2c2c2e",
    input: "#3a3a3c",
    border: "#48484a",
    primary: "#f5b83d",
    "on-primary": "#1c1c1e",
    text: "#f2f2f7",
    "text-muted": "#98989f",
  } satisfies Colors,
} as const;

export type PaletteName = keyof typeof palette;
