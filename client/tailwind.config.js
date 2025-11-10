/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626', // red-600
          dark: '#991B1B', // red-800
          light: '#FCA5A5', // red-300
        },
        dark: {
          DEFAULT: '#000000',
          light: '#1F1F1F',
          lighter: '#2D2D2D',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
