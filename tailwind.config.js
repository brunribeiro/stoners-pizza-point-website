/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './widgets/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
    './utils/**/**/*.{js,ts,jsx,tsx}',
    './hook/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        chivo: ['Chivo , monospace'],
        stone: ['MI_StonedType'],
      },
      colors: {
        'light-border': '#f0efed',
        foreground: '#9D9D9C',
        primary: '#e30613',
        'dark-blue': '#0E0C5C',
        'primary-light': '#F9F8F6',
        'primary-max-light': '#ecf8fd',
        'dark-primary': '#C42B44',
        'secondary-gray': '#dadada',
        'dark-border': '#e5e5e5',
        blue: '#02A2FF',
        secondary: '#F2F6F9',
        'light-gray': '#ddd',
        label: '#CECECE',
        green: '#52AE32',
        'dark-green': '#01af5f',
        'light-green': '#35DF91',
        yellow: '#F0B826',
        'light-yellow': '#FAC762',
        red: '#ff3939',
        'light-pink': '#FFDAE1',
        pink: '#FF0030',
        'dark-gray': '#666666',
        'charcoal-gray': '#3c3c3c',
        'thin-gray': '#222222',
        'disabled-gray': '#f2f2f2',
        'stone-black': '#606060',
        'stoners-black': '#606060',
        orange: '#FE9000',
      },

      fontSize: {
        lg: '16px',
        'btn-txt': '18px',
      },
      fontWeight: {
        normal: 400,
      },
      screens: {
        xs: '425px',
      },
    },
  },
  plugins: [],
};
