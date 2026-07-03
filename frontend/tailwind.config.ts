import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        primary: "#2563EB",
        ink: "#0F172A",
        canvas: "#F8FAFC",
        line: "#E2E8F0"
      }
    }
  },
  plugins: []
};

export default config;

