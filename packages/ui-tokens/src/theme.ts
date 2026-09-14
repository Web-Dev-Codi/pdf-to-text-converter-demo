import { type PaletteName, palette } from "./colors";
import { radii } from "./radii";
import { fontFamily, fontSize } from "./typography";

export const theme = {
  color: palette.dark,
  borderRadius: {
    card: radii.xl,
    input: radii.md,
    pill: radii.full,
  },
  fontFamily,
  fontSize,
} as const;

export type Theme = typeof theme;
export type { PaletteName };
