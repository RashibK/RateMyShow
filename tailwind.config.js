/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
        colors: {
        background: '#0B0F10',
        primary_text: '#ECEFF4',
        secondary_text: '##A5ACBA',
        border: '#2C3238',
        button_hover_bg: '#2B3139',
        card_bg: '#1A1E22',
        nav: '#1A2024',

      }
    },
  },
  plugins: [],
}

