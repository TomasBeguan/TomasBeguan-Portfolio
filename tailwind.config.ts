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
        retro: {
          bg: "#ffffff",
          text: "#000000",
          gray: "#cccccc",
          dark: "#333333",
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
        "retro": "4px 4px 0px 0px #000000",
        "retro-sm": "2px 2px 0px 0px #000000",
        "retro-lg": "8px 8px 0px 0px #000000",
      },
    },
  },
  plugins: [],
};
export default config;
