/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#150a28',
        'bg-mid': '#241340',
        'bg-panel': '#2c1a4d',
        pink: '#ff8fd6',
        'pink-soft': '#ffb8e6',
        lavender: '#b9a3ff',
        mint: '#7ee8c7',
        ink: '#f5f0ff',
        'ink-dim': '#b7a8d9',
        'ink-faint': '#8577a8',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
