import { theme } from "./src/theme";

const config = {
  theme: {
    extend: {
      colors: theme.color,
      borderRadius: {
        card: `${theme.borderRadius.card}px`,
        input: `${theme.borderRadius.input}px`,
        pill: `${theme.borderRadius.pill}px`,
      },
      fontFamily: theme.fontFamily,
      fontSize: Object.fromEntries(
        Object.entries(theme.fontSize).map(([name, px]) => [name, `${px}px`]),
      ),
    },
  },
};

export default config;