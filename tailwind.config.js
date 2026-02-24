/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'badge-entrance': 'badge-entrance 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'aura-pulse': 'aura-pulse 4s ease-in-out infinite',
        'loading-bar': 'loading-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'badge-entrance': {
          '0%': { transform: 'scale(0.8) translateY(30px)', opacity: '0', filter: 'brightness(0) contrast(1.5)' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1', filter: 'brightness(1.1) contrast(1.1)' },
        },
        'aura-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.95)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' },
        },
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }
    },
  },
  plugins: [],
}
