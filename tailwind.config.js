/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Cormorant Garamond', 'Playfair Display', 'serif'],
        'sans': ['Inter', 'Montserrat', 'sans-serif'],
        'display': ['Bodoni Moda', 'Didot', 'serif'],
      },
      colors: {
        'cream': '#fdfbf7',
        'warm-gray': '#1a1a1a',
        'pearl': '#f8f6f0',
        'champagne': '#f7e7ce',
        'rose-gold': '#e8b4b8',
        'deep-charcoal': '#2c2c2c',
        'soft-black': '#0f0f0f',
        'accent-red': '#E63946',
        'muted-gold': '#d4af37',
        'sage': '#9caf88',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'reveal': 'reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1)',
        'magnetic': 'magnetic 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(230, 57, 70, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(230, 57, 70, 0.8)' },
        },
        reveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        magnetic: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(var(--x, 0), var(--y, 0))' },
        },
      },
    },
  },
  plugins: [],
}