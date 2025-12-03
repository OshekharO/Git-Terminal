/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './script.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0d1117',
          secondary: '#161b22',
          tertiary: '#1a1f2e',
          input: '#21262d',
          border: '#30363d',
          'border-hover': '#484f58',
        },
        git: {
          branch: '#f778ba',
          added: '#3fb950',
          modified: '#d29922',
          deleted: '#f85149',
          untracked: '#8b949e',
        },
        accent: {
          blue: '#58a6ff',
          green: '#3fb950',
          yellow: '#d29922',
          red: '#f85149',
          purple: '#a371f7',
          pink: '#f778ba',
          orange: '#f0883e',
        },
      },
      animation: {
        'blink': 'blink 1s infinite',
        'fade-in': 'fadeIn 150ms ease-out',
        'success-pulse': 'successPulse 0.6s ease-out',
        'error-shake': 'errorShake 0.3s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        successPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(63, 185, 80, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(63, 185, 80, 0)' },
        },
        errorShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
