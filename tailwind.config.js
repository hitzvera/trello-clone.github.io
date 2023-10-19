/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}', '*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'bai-jamjuree': ['Bai Jamjuree', 'sans-serif'],
        'Pacifico': ['Pacifico', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

