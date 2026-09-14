export interface Colors {
  surface: string;
  "surface-elevated": string;
  input: string;
  border: string;
  primary: string;
  "on-primary": string;
  cyan: string;
  text: string;
  "text-muted": string;
}

export const palette = {
  dark: {
    surface: "#0f1220",
    "surface-elevated": "#1a1e2e",
    input: "#161a2a",
    border: "#4a3a6b",
    primary: "#ff2e97",
    "on-primary": "#1a0b2e",
    cyan: "#00f0ff",
    text: "#e8e2f5",
    "text-muted": "#9a8fb8",
  } satisfies Colors,
} as const;

export type PaletteName = keyof typeof palette;
