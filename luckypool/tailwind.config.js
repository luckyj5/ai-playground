/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          50: '#EAF6EE',
          100: '#C9E6D1',
          200: '#8FCCA1',
          300: '#55B271',
          400: '#2E9A52',
          500: '#1F7F3F',
          600: '#145F2F',
          700: '#0D4522',
          800: '#082D17',
          900: '#041A0D',
        },
        chalk: {
          DEFAULT: '#F3F1EA',
          muted: '#D9D5C8',
        },
        cue: {
          DEFAULT: '#B87333',
          accent: '#E4A94A',
        },
        rail: '#2B1810',
        ink: '#0B1410',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Inter', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        table: '0 20px 60px -20px rgba(0,0,0,0.6), inset 0 0 0 6px #2B1810',
        cue: '0 0 0 1px rgba(228,169,74,0.3), 0 8px 24px -8px rgba(228,169,74,0.35)',
      },
      backgroundImage: {
        'felt-gradient':
          'radial-gradient(ellipse at top, #1F7F3F 0%, #145F2F 40%, #082D17 100%)',
        'rail-gradient':
          'linear-gradient(180deg, #3B2015 0%, #2B1810 50%, #1A0E08 100%)',
      },
      animation: {
        'fade-in': 'fadeIn .35s ease-out',
        'slide-up': 'slideUp .35s ease-out',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.65 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
