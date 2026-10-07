/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        display: ['Outfit', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        glass: {
          light: "rgba(255, 255, 255, 0.65)",
          border: "rgba(255, 255, 255, 0.45)",
          dark: "rgba(15, 23, 42, 0.55)",
          darkBorder: "rgba(255, 255, 255, 0.12)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
        "glass-sm": "0 4px 16px 0 rgba(31, 38, 135, 0.05)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.12)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glow-cyan": "0 0 25px -3px rgba(6, 182, 212, 0.35)",
        "glow-purple": "0 0 25px -3px rgba(168, 85, 247, 0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
