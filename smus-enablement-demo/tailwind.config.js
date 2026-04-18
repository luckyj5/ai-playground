/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aws: {
          squid: '#232F3E',
          night: '#0F1B2D',
          orange: '#FF9900',
          sky: '#00A1C9',
          slate: '#1B2A3A',
          mist: '#16202F',
          cloud: '#E9EDF1',
          accent: '#6BA4FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Amazon Ember', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(107,164,255,0.25), 0 8px 24px -8px rgba(107,164,255,0.35)',
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
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
