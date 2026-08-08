/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#06080f',
        'card': 'rgba(18,22,36,0.75)',
        'border-light': 'rgba(255,255,255,0.05)',
        'primary': '#8b5cf6',
        'secondary': '#06b6d4',
        'accent': '#f472b6',
        'text-main': '#f1f3f5',
        'text-muted': '#8892a0',
      },
      fontFamily: {
        head: ['Space Grotesk', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
}