/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#3D5A80',
          light: '#6A8CAD',
          dark: '#2A3F5C',
        },
        ochre: {
          DEFAULT: '#C8963E',
          light: '#E0B96A',
          dark: '#A07020',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          dark: '#EAE2D0',
        },
        terracotta: {
          DEFAULT: '#B85C38',
          light: '#D4876A',
          dark: '#8C3E20',
        },
        botanical: {
          DEFAULT: '#5C7A4E',
          light: '#7A9E6A',
          dark: '#3E5835',
        },
        'warm-text': '#2C2416',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2C2416',
            fontFamily: '"Source Sans 3", system-ui, sans-serif',
          },
        },
      },
    },
  },
  plugins: [],
}
