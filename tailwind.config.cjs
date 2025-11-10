/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        soft: '0 2px 10px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
