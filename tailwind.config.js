/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bae0ff',
          300: '#7eb8e8',
          400: '#4da3e0',
          500: '#2389d0',
          600: '#166cb0',
          700: '#125490',
          800: '#103d6a',
          900: '#0c2a4a',
        },
        blush: { 100: '#fff0f3', 300: '#f9c8d4', 500: '#e88fa0' },
        mint: { 100: '#f0fdf7', 300: '#86efcc', 500: '#34c78a' }
      },
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.10)',
        'glass-lg': '0 16px 48px rgba(31, 38, 135, 0.14)',
        card: '0 2px 16px rgba(30, 80, 140, 0.08)',
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-soft': 'bounceSoft 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.9)' }, to: { opacity: '1', transform: 'scale(1)' } },
        bounceSoft: { '0%': { transform: 'scale(0.8)' }, '60%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)' } },
      }
    }
  },
  plugins: []
}
