/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Google-inspired color palette
        primary: {
          DEFAULT: '#1a73e8', // Google Blue
          dark: '#1765cc',
        },
        secondary: {
          DEFAULT: '#34a853', // Google Green
        },
        accent: {
          DEFAULT: '#fbbc05', // Google Yellow
        },
        danger: {
          DEFAULT: '#ea4335', // Google Red
        },
        neutral: {
          lightest: '#f8f9fa',
          light: '#e9ecef',
          DEFAULT: '#dee2e6',
          dark: '#adb5bd',
          darkest: '#202124', // Google Dark Grey
        },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans JP"', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [
  ],
}