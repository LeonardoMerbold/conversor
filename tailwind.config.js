/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        '70%': '70%',
      },
      keyframes: {
        press: {
          '0%, 100%': { transform: 'translateY(8%)' },
          '50%': { transform: 'translateY(0)' }
        },
        rotation: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' }
        }
      },
      animation: {
        'press-button': 'press 1s',
        'rotate-icon': 'rotation 0.6s',
      },
    },
  },
  plugins: [],
}
