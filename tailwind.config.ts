import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0d0f",
          900: "#121417",
          800: "#1f2226",
          700: "#2c3137",
          600: "#3a4149",
          200: "#e3e6ea",
          100: "#f5f6f8"
        },
        mint: {
          700: "#0e8a5f",
          600: "#11a36f",
          500: "#19c37d",
          100: "#e6f8f0"
        },
        cloud: {
          50: "#fcfcfd",
          100: "#f7f8fa",
          200: "#eef1f4"
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(11, 13, 15, 0.08)",
        card: "0 18px 60px rgba(11, 13, 15, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
