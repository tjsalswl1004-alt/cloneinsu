/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4F6EF7',
        'primary-dark': '#3B5BDB',
      },
    },
  },
  plugins: [],
};
