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
        inter: ["Inter", "system-ui", "Arial"],
        inter_tight: ["Inter Tight", "system-ui", "Arial"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
