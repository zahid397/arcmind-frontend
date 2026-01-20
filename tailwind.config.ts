import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        arc: {
          blue: "#0066FF",
          purple: "#7C3AED",
          green: "#10B981",
          cyan: "#06B6D4",
          pink: "#EC4899",
        }
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "border": "border 4s ease infinite",
      },
      keyframes: {
        border: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
