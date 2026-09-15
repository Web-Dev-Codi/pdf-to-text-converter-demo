import { gradientPalette, palette } from "./colors.ts";
import { radii } from "./radii.ts";
import { shadows, textShadows } from "./shadows.ts";
import { fontFamily, fontSize } from "./typography.ts";

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
