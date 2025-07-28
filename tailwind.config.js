/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'star-blue': '#1e3a8a',
        'deep-space': '#0f0f23',
        'milky-way': '#a8b5ff',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}