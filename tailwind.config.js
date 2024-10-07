module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './assets/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6D28D9', // Violet-700
        'secondary': '#4C1D95', // Violet-900
        'accent': '#8B5CF6', // Violet-500
        gray: {
          950: '#09090b',
          900: '#101012',
          800: '#1d1d20',
          700: '#2e2e33',
          400: '#a1a1aa',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}