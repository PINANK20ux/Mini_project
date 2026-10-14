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
        brand: {
          teal: "#2D7495",
          gold: "#E8E085",
        },
        cyan: {
          50: "#f0f7fa",
          100: "#dbeef5",
          200: "#bce0ed",
          300: "#8eccde",
          400: "#4f9bb6",
          500: "#2D7495",
          600: "#245f7b",
          700: "#1f4e65",
          800: "#1d4355",
          900: "#1b3947",
          950: "#0d2430",
        },
        sky: {
          400: "#5ba2bf",
          500: "#2D7495",
          600: "#245f7b",
        },
        amber: {
          50: "#fcfbf3",
          100: "#f9f6e4",
          200: "#f3edca",
          300: "#E8E085",
          400: "#ddce58",
          500: "#E8E085",
          600: "#b5a329",
          700: "#8e7f1f",
          800: "#6e6219",
          900: "#554c15",
          950: "#362f0a",
        },
        yellow: {
          300: "#E8E085",
          400: "#E8E085",
          500: "#d8ce5d",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.65)",
          border: "rgba(255, 255, 255, 0.45)",
          dark: "rgba(11, 34, 45, 0.55)",
          darkBorder: "rgba(255, 255, 255, 0.12)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(45, 116, 149, 0.08)",
        "glass-sm": "0 4px 16px 0 rgba(45, 116, 149, 0.05)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.12)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glow-teal": "0 0 25px -3px rgba(45, 116, 149, 0.45)",
        "glow-gold": "0 0 25px -3px rgba(232, 224, 133, 0.45)",
        "glow-cyan": "0 0 25px -3px rgba(45, 116, 149, 0.45)",
        "glow-purple": "0 0 25px -3px rgba(232, 224, 133, 0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
