/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: "#8B9A6E",
          hover: "#78875C",
          dark: "#63724B",
          light: "#F1F4ED",
          tint: "#E4EAD9",
        },
        linen: {
          DEFAULT: "#F7F2EB",
          dark: "#181916",
        },
        sandstone: {
          DEFAULT: "#EAE2D6",
          dark: "#24231F",
          card: "#EFE8DC",
        },
        ash: {
          DEFAULT: "#EEEEEE",
          border: "#DCD5C9",
          dark: "#2E2D27",
        },
        charcoal: {
          DEFAULT: "#1F211C",
          muted: "#4D5047",
          light: "#70736A",
        },
      },
    },
  },
  plugins: [],
};
