/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      colors: {
        btn: '#6b05de',
        'btn-hover': '#5a04c7',
        'btn-active': '#4803a0',

        accent: '#8c00ff',
        'accent-hover': '#7100cc',

        'primary-text': '#e0e0e0',
        'secondary-text': '#b3b3b3',
        'muted-text': '#808080',

        border: '#3b3663',
        'input-bg': '#1a1738',
        'input-border': '#5a5480',

        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',

        'navbar-bg': '#121829',
        'navbar-border': '#272f4b',
        'navbar-link': '#e0e0e0',
        'navbar-link-hover': '#b67aff',
        'navbar-link-active': '#8c00ff',

        'sidebar-bg': '#0c0926',
        'sidebar-border': '#3b3663',
        'sidebar-text': '#d1d5db',

        'card-bg': '#181b3a',
        'card-border': '#3b3663',

        'btn-disabled-bg': '#555555',
        'btn-logout-bg': '#8c00ff',
        'btn-logout-hover': '#5a04c7'
      },
    },
  },
  plugins: [],
}
