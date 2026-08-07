import type { Config } from 'tailwindcss'

// Colors sampled directly (pixel-picked) from your Figma exports — not
// approximated. If your real Figma file ever changes these, this is the
// one place to update; every component references these tokens.
export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FBF7EF',
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#1A1A2E', // sampled from headline + logo "Ve"
          muted: '#6E6E80',
        },
        brand: {
          green: '#007054', // sampled from "Start Your Journey" button
          greenDark: '#00593F',
          orange: '#F26B3A', // sampled from logo "ra" + progress fill + "View All"
          orangeDark: '#D9552A',
        },
        navy: {
          DEFAULT: '#1E2438', // sampled from My Space profile card (top-left of gradient)
          light: '#4A7A93', // sampled bottom-right of the same gradient
        },
        pastel: {
          peach: '#FBEADD',
          mint: '#E1F3E7',
          pink: '#FBE4EA',
          blue: '#E4EEF7',
          lavender: '#EAE4F5',
          butter: '#FBF0D6',
        },
        // Deeper "ink" tone of each pastel, used for icon chips / accents on
        // that topic's own pages so the theme reads as intentional, not just
        // a pale background.
        pastelInk: {
          peach: '#C9713D',
          mint: '#1F8B57',
          pink: '#C94F72',
          blue: '#3874AD',
          lavender: '#6F58B8',
          butter: '#B8862A',
        },
        free: {
          bg: '#DCF0E7',
          text: '#007054',
        },
        locked: {
          bg: '#E0DED9',
          text: '#8A8374',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        logo: ['var(--font-logo)'],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,26,46,0.04), 0 1px 8px rgba(26,26,46,0.06)',
        hover: '0 8px 24px rgba(26,26,46,0.12)',
        lift: '0 16px 40px rgba(26,26,46,0.16)',
        glow: '0 0 0 1px rgba(242,107,58,0.15), 0 8px 30px rgba(242,107,58,0.18)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blobMove: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.97)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.4s ease both',
        'pop-in': 'popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 3s ease-in-out infinite',
        blob: 'blobMove 12s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
