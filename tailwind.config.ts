import type { Config } from "tailwindcss";

const tokenColor = (name: string) => `rgb(var(--dev-color-${name}) / <alpha-value>)`;

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
          bg: tokenColor("bg"),
          surface: tokenColor("surface"),
          elevated: tokenColor("elevated"),
          border: tokenColor("border"),
          "border-bright": tokenColor("border-bright"),
          accent: tokenColor("accent"),
          "accent-dim": tokenColor("accent-dim"),
          "accent-glow": "rgb(var(--dev-color-accent) / 0.15)",
          text: tokenColor("text"),
          secondary: tokenColor("secondary"),
          muted: tokenColor("muted"),
          cyan: tokenColor("cyan"),
          amber: tokenColor("amber"),
          red: tokenColor("red"),
          purple: tokenColor("purple"),
        },
      },
      fontFamily: {
        mono: ["var(--dev-font-mono)"],
        sans: ["var(--dev-font-sans)"],
      },
      borderRadius: {
        control: "var(--dev-radius-control)",
        panel: "var(--dev-radius-panel)",
        window: "var(--dev-radius-window)",
      },
      transitionDuration: {
        fast: "var(--dev-duration-fast)",
        standard: "var(--dev-duration-standard)",
        reveal: "var(--dev-duration-reveal)",
      },
      boxShadow: {
        window: "var(--dev-shadow-window)",
        "window-focus": "var(--dev-shadow-window-focus)",
        glow: "0 0 15px rgb(var(--dev-color-accent) / 0.35)",
        "glow-cyan": "0 0 15px rgb(var(--dev-color-cyan) / 0.35)",
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
