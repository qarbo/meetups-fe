/** @type {import('tailwindcss').Config} */
module.exports = {  
  darkMode: 'media',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'pt-sans': ['PT Sans', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'noto-sans': ['Noto Sans', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'arial': ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

