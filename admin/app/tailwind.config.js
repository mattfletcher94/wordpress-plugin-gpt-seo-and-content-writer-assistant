/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#2271B1',
          50: '#9EC9EC',
          100: '#8DC0E9',
          200: '#6BADE3',
          300: '#499ADC',
          400: '#2987D3',
          500: '#2271B1',
          600: '#195382',
          700: '#103553',
          800: '#071724',
          900: '#000000',
        },
        'secondary': {
          50: '#fdfeff',
          100: '#fcfcff',
          200: '#f6f8fe',
          300: '#f1f3fe',
          400: '#e7eafd',
          500: '#dce1fc',
          600: '#B2BCF1',
          700: '#8895DD',
        },
        'wp-border': {
          DEFAULT: '#c3c4c7',
          500: '#c3c4c7',
        },
      },
    },
    container: {
      center: true,
      padding: '1.5rem',
    },
  },
  plugins: [],
  // Add tw- prefix
  prefix: 'tw-',
  //important: '#wpAIAssistantWrap',
}

