import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1020",
        foreground: "#e9edff",
        card: "#121a33",
        border: "#2a355f",
        muted: "#9da7c7",
        accent: "#8aa2ff"
      }
    }
  },
  plugins: [],
};

export default config;
