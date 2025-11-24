import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--main-color)",
        retro: {
          bg: "#ffffff",
          text: "var(--main-color)",
          gray: "#cccccc",
          dark: "var(--main-color)",
          "dark-blue": "#0d1117", // Bluish black 90%
        },
      },
      fontFamily: {
        "space-grotesk": ["var(--font-space-grotesk)"],
        inter: ["var(--font-inter)"],
        ultra: ["var(--font-ultra)"],
        libre: ["var(--font-libre)"],
        silkscreen: ["var(--font-silkscreen)"],
        chicago: ["var(--font-chicago)", "sans-serif"],
      },
      backgroundImage: {
        "retro-grid": "url('/grid-pattern.png')", // Placeholder, we will create this with CSS or SVG
      },
      boxShadow: {
        "retro": "4px 4px 0px 0px var(--main-color)",
        "retro-sm": "2px 2px 0px 0px var(--main-color)",
        "retro-lg": "8px 8px 0px 0px var(--main-color)",
      },
    },
  },
  plugins: [],
};
export default config;
