import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          700: "#9b5860",
          600: "#B76E79",
          500: "#C88A93",
          100: "#F5E6E8"
        },
        beige: {
          100: "#F5E6E8",
          50: "#FAF9F8"
        },
        charcoal: {
          900: "#2C2C2C",
          700: "#3A3A3A",
          500: "#5B5B5B",
          100: "#E6E2E2"
        },
        offwhite: "#FAF9F8",
        success: "#6FCF97",
        error: "#EB5757",
        ink: {
          950: "#2C2C2C",
          900: "#2C2C2C",
          800: "#3A3A3A",
          700: "#4A4A4A",
          600: "#5B5B5B",
          200: "#E6E2E2",
          100: "#F2EEEF"
        },
        mint: {
          700: "#9b5860",
          600: "#B76E79",
          500: "#C88A93",
          100: "#F5E6E8"
        },
        cloud: {
          50: "#FAF9F8",
          100: "#F5E6E8",
          200: "#EEE3E5"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(44, 44, 44, 0.08)",
        card: "0 18px 60px rgba(44, 44, 44, 0.14)",
        glow: "0 12px 40px rgba(183, 110, 121, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
