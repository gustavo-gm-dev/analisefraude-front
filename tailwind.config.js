/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e94560',
        'primary-dark': '#f45c43',
        success: '#38ef7d',
        'success-dark': '#11998e',
        error: '#f45c43',
        'error-dark': '#eb3349',
        warning: '#f5576c',
      },
      spacing: {
        '128': '32rem',
      },
      ringWidth: {
        '3': '3px',
      },
      animation: {
        slideDown: 'slideDown 0.3s ease-out',
        popIn: 'popIn 0.3s ease-out',
      },
      keyframes: {
        slideDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        popIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
