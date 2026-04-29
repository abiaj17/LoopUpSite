/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      DEFAULT: "1rem",
      md: "1rem",
      lg: "1rem",
      xl: "1rem",
      "2xl": "1rem",
      full: "9999px"
    },
    extend: {
      colors: {
        ink: "#000000",
        paper: "#ffffff",
        system: "#f5f5f7",
        secondary: "#000000",
        line: "#d2d2d7",
        accent: "#0071e3"
      },
      fontFamily: {
        sans: ["SF Pro Display", "SF Pro Text", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
