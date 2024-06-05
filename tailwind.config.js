/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#e1e0de",
        primary: "#161616",
      },
      fontFamily: {
        overpass: ["Overpass", "system-ui", "Arial"],
        spectral: ["Spectral", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
