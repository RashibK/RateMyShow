/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0F10",
        primary_text: "#ECEFF4",
        secondary_text: "#A5ACBA",
        border: "#2C3238",
        button_hover_bg: "#2B3139",
        card_bg: "#1A1E22",
        nav: "#1A2024",
      },
      keyframes: {
        "sk-bouncedelay": {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1.0)" },
        },
      },
      animation: {
        "sk-bouncedelay": "sk-bouncedelay 1.4s infinite ease-in-out both",
      },
    },
  },
  plugins: [],
};
