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

export interface GradientColors {
  "grad-void": string;
  "grad-haze": string;
  "grad-ember": string;
  "grad-rose": string;
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

export const gradientPalette = {
  dark: {
    "grad-void": "#12101f",
    "grad-haze": "#2a1a4a",
    "grad-ember": "#6a1e8f",
    "grad-rose": "#d43a8e",
  } satisfies GradientColors,
} as const;

export type PaletteName = keyof typeof palette;
