import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        panel: "#111113",
        card: "#16161a",
        border: "#26262b",
        accent: "#facc15",
        accent2: "#fbbf24",
        muted: "#8a8a93",
      },
    },
  },
  plugins: [],
} satisfies Config;
