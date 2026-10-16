/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      colors: {
        night: '#070918',
        twilight: '#161332',
        pastelPink: '#f4b8c8',
        lavender: '#b8a9e0',
        warmAmber: '#f6b96e',
        sunriseGold: '#ffd280',
      },
    },
  },
  plugins: [],
};
