/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        title: 'rgb(var(--color-title) / <alpha-value>)',
        button: 'rgb(var(--color-button) / <alpha-value>)',
        textWhite: 'rgb(var(--color-text-white) / <alpha-value>)',
        backgroundCard: 'rgb(var(--color-background-card) / <alpha-value>)',
        backgroundHint: 'rgb(var(--color-background-hint) / <alpha-value>)',
        secondaryButton: 'rgb(var(--color-secondary-button) / <alpha-value>)',
        correctOption: 'rgb(var(--color-correct-option) / <alpha-value>)',
        incorrectOption: 'rgb(var(--color-incorrect-option) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'bounce-light': 'bounceLight 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};