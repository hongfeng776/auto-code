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
        primary: {
          50: '#00F5C7',
          100: '#00E8BC',
          200: '#00D4AA',
          300: '#00C099',
          400: '#00A885',
          500: '#008F6F',
          600: '#00755A',
          700: '#005C47',
          800: '#004233',
          900: '#00291F',
        },
        dark: {
          50: '#3A4A5F',
          100: '#2D3B4E',
          200: '#1F2B3D',
          300: '#152030',
          400: '#0F1825',
          500: '#0A1628',
          600: '#081220',
          700: '#060E18',
          800: '#040810',
          900: '#020408',
        },
        risk: {
          high: '#FF4757',
          medium: '#FFA502',
          low: '#2ED573',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      }
    },
  },
  plugins: [],
};
