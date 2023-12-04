/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        press: {
          '0%, 100%': { transform: 'translateY(8%)' },
          '50%': { transform: 'translateY(0)' }
        },
      },
      animation: {
        'press-button': 'press 1s',
      },
    },
  },
  plugins: [],
}
