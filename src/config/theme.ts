export const THEME_CONFIG = {
  defaultTheme: "dark",
  borderRadius: "0.75rem",
  colors: {
    dark: {
      background: "#0a0a0f",
      surface: "#12121c",
      border: "rgba(255, 255, 255, 0.05)",
      primary: "#22d3ee",
      indigo: "#6366f1",
      violet: "#a855f7",
    },
    light: {
      background: "#ffffff",
      surface: "#f8fafc",
      border: "#e2e8f0",
      primary: "#0284c7",
      indigo: "#4f46e5",
      violet: "#7c3aed",
    },
  },
} as const;
