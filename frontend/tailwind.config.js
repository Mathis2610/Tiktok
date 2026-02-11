/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00f2ea',
        secondary: '#ff0050',
        dark: '#0a0a0a',
      },
    },
  },
  plugins: [],
}