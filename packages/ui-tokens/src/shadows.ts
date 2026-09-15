export interface Shadows {
  card: string;
  "glow-primary": string;
  "glow-primary-soft": string;
  "glow-cyan": string;
}

export const shadows = {
  card: "0 8px 24px rgb(0 0 0 / 0.35)",
  "glow-primary":
    "0 0 14px color-mix(in oklab, var(--color-primary) 67%, transparent)",
  "glow-primary-soft":
    "0 0 10px color-mix(in oklab, var(--color-primary) 40%, transparent)",
  "glow-cyan":
    "0 0 8px color-mix(in oklab, var(--color-cyan) 33%, transparent)",
} as const;

export const textShadows = {
  "glow-primary":
    "0 0 8px color-mix(in oklab, var(--color-primary) 25%, transparent)",
} as const;

export type ShadowName = keyof typeof shadows;
