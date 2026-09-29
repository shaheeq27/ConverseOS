import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        surface: {
          0: "var(--color-bg)",
          1: "var(--color-surface-1)",
          2: "var(--color-surface-2)",
          3: "var(--color-surface-3)",
          4: "var(--color-surface-4)",
        },
        accent: {
          cyan: "var(--color-accent-cyan)",
          violet: "var(--color-accent-violet)",
          emerald: "var(--color-accent-emerald)",
          amber: "var(--color-accent-amber)",
          rose: "var(--color-accent-rose)",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "glow-conic":
          "conic-gradient(from 180deg at 50% 50%, #0ea5e9 0deg, #8b5cf6 180deg, #0ea5e9 360deg)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "typing": "typing 1.2s steps(3) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(14,165,233,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(14,165,233,0.6)" },
        },
        typing: {
          "0%": { content: "." },
          "33%": { content: ".." },
          "66%": { content: "..." },
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(14,165,233,0.25)",
        "glow-violet": "0 0 30px rgba(139,92,246,0.25)",
        "glow-emerald": "0 0 30px rgba(16,185,129,0.25)",
        "inner-light": "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
