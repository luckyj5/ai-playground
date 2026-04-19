import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#F7F5F2",
          100: "#EDE8E1",
          200: "#D7CEC1",
          300: "#B9AC99",
          400: "#8E8170",
          500: "#5F5548",
          600: "#3F382F",
          700: "#2A2520",
          800: "#1A1612",
          900: "#0E0C0A",
        },
        accent: {
          DEFAULT: "#C8A96A",
          soft: "#E9D9B7",
          deep: "#8C6F3E",
        },
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(20, 16, 12, 0.15)",
        ring: "0 0 0 1px rgba(200, 169, 106, 0.35)",
      },
      backgroundImage: {
        "radial-spot":
          "radial-gradient(circle at 20% 0%, rgba(200,169,106,0.18), transparent 55%), radial-gradient(circle at 85% 20%, rgba(200,169,106,0.10), transparent 55%)",
      },
    },
  },
  plugins: [],
};

export default config;
