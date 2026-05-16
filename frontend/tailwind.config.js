/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc7fb",
          400: "#36aaf6",
          500: "#0c91e8",
          600: "#0172c5",
          700: "#025a9f",
          800: "#064d83",
          900: "#0a406d",
          950: "#072947",
        },
        surface: "#f8fafc",
        dark: "#0f172a",
      },
    },
  },
  plugins: [],
};
