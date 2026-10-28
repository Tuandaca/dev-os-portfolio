import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dev: {
          bg: "#080D12",
          surface: "#111C24",
          elevated: "#16242F",
          border: "#294039",
          "border-bright": "#3D6257",
          accent: "#6EE7A0",
          "accent-dim": "#22C55E",
          "accent-glow": "rgba(110, 231, 160, 0.15)",
          text: "#E4F2ED",
          secondary: "#94A3B8",
          muted: "#64748B",
          cyan: "#38BDF8",
          amber: "#FBBF24",
          red: "#F87171",
          purple: "#C084FC",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Geist Mono", "Consolas", "monospace"],
        sans: ["Geist Sans", "Space Grotesk", "Inter", "sans-serif"],
      },
      boxShadow: {
        window: "0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(41, 64, 57, 0.6)",
        "window-focus": "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(110, 231, 160, 0.2), 0 0 0 1px #3D6257",
        glow: "0 0 15px rgba(110, 231, 160, 0.35)",
        "glow-cyan": "0 0 15px rgba(56, 189, 248, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
