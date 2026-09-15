import { gradientPalette, palette } from "./colors";
import { radii } from "./radii";
import { shadows, textShadows } from "./shadows";
import { fontFamily, fontSize } from "./typography";

export const theme = {
  color: { ...palette.dark, ...gradientPalette.dark },
  borderRadius: {
    card: radii.xl,
    input: radii.md,
    pill: radii.full,
  },
  fontFamily,
  fontSize,
  shadows,
  textShadows,
} as const;

export type Theme = typeof theme;
