/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      colors: {
        background: {
          DEFAULT: '#fafaf9',
          dark: '#0c0a09',
        },
        foreground: {
          DEFAULT: '#1c1917',
          dark: '#e7e5e4',
        },
        muted: {
          DEFAULT: '#a8a29e',
          dark: '#78716c',
        },
        accent: {
          DEFAULT: '#d97706',
          dark: '#f59e0b',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
