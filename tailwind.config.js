/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens extraídos do Figma (01 Editorial cinematográfico)
      colors: {
        fundo: '#080808',
        texto: '#f8f8f5',
        suave: '#a1a1a1',
        linha: '#303030',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
