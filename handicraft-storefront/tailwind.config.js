/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Indian heritage palette: saffron, terracotta, indigo, ivory
        saffron: {
          50: '#FFF6E6',
          100: '#FFE9BF',
          200: '#FFD680',
          300: '#FFC14D',
          400: '#F5A623',
          500: '#E08E12',
          600: '#B56E09',
          700: '#8A5206',
        },
        terracotta: {
          50: '#FBEFE8',
          100: '#F2D6C4',
          200: '#E3A98B',
          300: '#D07E55',
          400: '#B85E35',
          500: '#9A4722',
          600: '#76361A',
        },
        indigo: {
          ink: '#1B2A59',
          dusk: '#2A3D7A',
          night: '#0F1B3D',
        },
        ivory: '#FBF6EC',
        parchment: '#F3E9D2',
        bark: '#3B2A1A',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        craft: '0 2px 0 rgba(58,40,22,0.04), 0 10px 24px -12px rgba(58,40,22,0.25)',
      },
      backgroundImage: {
        'block-print':
          "radial-gradient(circle at 1px 1px, rgba(154,71,34,0.18) 1px, transparent 0)",
      },
      animation: {
        'fade-in': 'fadeIn .35s ease-out',
        'slide-up': 'slideUp .35s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
