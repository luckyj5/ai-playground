/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base surface — a deep, warm near-black charcoal (no green tint).
        ink: {
          DEFAULT: '#0A0C12',
          soft: '#0F1218',
          raised: '#161A24',
          elevated: '#1D2230',
        },
        // Pool-table felt — kept as an accent only (discipline chips, hero haze).
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
        // Warm neutral ink for body copy — pushed lighter for readability.
        chalk: {
          DEFAULT: '#F7F5EE',
          muted: '#CBC6B9',
          dim: '#8E8A7E',
        },
        // Antique-gold signature — replaces the old copper.
        cue: {
          DEFAULT: '#CBA24B',
          accent: '#F0C75E',
          deep: '#8F6C1E',
        },
        // Leather rail / wooden trim — kept for the table shadow vibe.
        rail: '#2B1810',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Display reuses Inter for a quieter, more readable headline voice.
        // Visual hierarchy comes from size, weight and tracking — not a serif.
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        table:
          '0 30px 80px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(240,199,94,0.12), inset 0 1px 0 rgba(255,255,255,0.04)',
        cue: '0 0 0 1px rgba(240,199,94,0.35), 0 10px 30px -10px rgba(240,199,94,0.45)',
        card:
          '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.8)',
        'card-hover':
          '0 1px 0 rgba(255,255,255,0.08) inset, 0 24px 48px -20px rgba(240,199,94,0.18)',
      },
      backgroundImage: {
        // Premium noir-gold hero background — charcoal with a warm gold vignette.
        'noir-gradient':
          'radial-gradient(ellipse at 20% 0%, rgba(240,199,94,0.22) 0%, rgba(240,199,94,0) 55%), radial-gradient(ellipse at 90% 100%, rgba(31,127,63,0.22) 0%, rgba(31,127,63,0) 55%), linear-gradient(160deg, #10131C 0%, #0A0C12 55%, #06080C 100%)',
        // Retained felt gradient for tournament banner stripes.
        'felt-gradient':
          'radial-gradient(ellipse at top, #1F7F3F 0%, #145F2F 40%, #082D17 100%)',
        'rail-gradient':
          'linear-gradient(180deg, #3B2015 0%, #2B1810 50%, #1A0E08 100%)',
        // Gold leaf gradient for primary CTA / winner accents.
        'gold-gradient':
          'linear-gradient(135deg, #F0C75E 0%, #CBA24B 40%, #8F6C1E 100%)',
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
