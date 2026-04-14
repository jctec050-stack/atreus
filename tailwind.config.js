/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'atreus-gold': {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#996515',
          accent: '#E6C45D'
        },
        'atreus-black': '#050505',
        'atreus-dark': '#0A0A0A',
        'atreus-card': '#111111',
        'atreus-border': '#1F1F1F'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.15)',
        'btn': '0 4px 14px 0 rgba(212, 175, 55, 0.39)',
      }
    },
  },
  plugins: [],
}
