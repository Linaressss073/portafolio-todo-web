/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        glow: '0 10px 50px -10px rgba(99, 102, 241, 0.4)'
      }
    }
  },
  plugins: []
};
