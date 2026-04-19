/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c3ddff',
          500: '#3a1fc6',
          600: '#2B13AF',
          700: '#1f0d85',
          DEFAULT: '#2B13AF'
        },
        secondary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c3ddff',
          500: '#818cf8',
          600: '#6366F1',
          700: '#4f46e5',
          DEFAULT: '#6366F1'
        },
        success: {
          DEFAULT: '#10B981',
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          DEFAULT: '#FBB833',
          500: '#FBB833',
          600: '#d97706',
        },
        error: {
          DEFAULT: '#FF1E35',
          500: '#FF1E35',
          600: '#e11d48',
        },
        draft: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          DEFAULT: '#334155'
        },
        pending: {
          100: '#fef3c7',
          200: '#fde68a',
          DEFAULT: '#b45309'
        },
        paid: {
          100: '#d1fae5',
          200: '#a7f3d0',
          DEFAULT: '#047857'
        },
        cancelled: {
          100: '#fee2e2',
          200: '#fecaca',
          DEFAULT: '#b91c1c'
        },
        background: '#F8FAFC'
      }
    },
  },
  plugins: [],
}
