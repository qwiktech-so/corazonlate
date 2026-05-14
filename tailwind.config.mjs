/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF0E8',
        'brand-red': '#8B2E22',
        'brand-terracotta': '#C85A42',
        'brand-gold': '#D4A520',
        'brand-border': '#E8D5C8',
        'brand-text': '#2D2D2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
