import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Digital Artisan palette - earthy, desaturated, premium
        fika: {
          cream: "#FAF6F1",
          latte: "#F0E8E0",
          caramel: "#DBC9B8",
          cinnamon: "#B8A08A",
          espresso: "#4A3728",
          mocha: "#2D1F14",
          honey: "#D4944C",
          berry: "#9B5A5A",
          sage: "#7D9B7A",
          sky: "#6A8FA8",
        },
        "card-bg": "#FFFCF9",
        background: "#FAF6F1",
        foreground: "#2D1F14",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        chinese: ["LXGW WenKai", "var(--font-outfit)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 1px 8px -2px rgba(74, 55, 40, 0.12), 0 4px 12px -2px rgba(74, 55, 40, 0.08)",
        glow: "0 0 40px -10px rgba(212, 148, 76, 0.25)",
        card: "0 1px 3px rgba(74, 55, 40, 0.06), 0 4px 12px rgba(74, 55, 40, 0.08)",
        "soft-layered": "0 1px 3px rgba(74, 55, 40, 0.06), 0 6px 14px rgba(74, 55, 40, 0.10), 0 20px 40px rgba(74, 55, 40, 0.14)",
        "tactile-inset": "inset 0 2px 4px rgba(74, 55, 40, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "spring-in": "springIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "bounce-subtle": "bounceSubtle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        springIn: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        bounceSubtle: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

