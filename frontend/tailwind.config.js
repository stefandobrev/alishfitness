/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        logored: {
          DEFAULT: 'hsl(0, 66%, 44%)',
          hover: 'hsl(0, 71%, 39%)',
          disabled: 'hsl(0, 66%, 44%, 0.5)',
        },
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--logored': theme('colors.logored.DEFAULT'),
        },
      });
    },
  ],
};
