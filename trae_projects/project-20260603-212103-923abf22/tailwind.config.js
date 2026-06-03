/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        dark: {
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#1e1e35',
          600: '#252545',
          500: '#2a2a4a',
          400: '#3a3a5a',
        },
        amber: {
          DEFAULT: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['Noto Sans SC', 'DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
