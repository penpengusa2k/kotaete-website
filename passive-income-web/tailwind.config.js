/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./nuxt.config.{js,ts}", // 必要であれば、nuxt.config.ts 内のクラスも対象にする
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // カスタムの青
        secondary: '#10b981', // カスタムの緑
        // ... 他の色
      },
      fontFamily: {
        // ★ここを修正★ Noto Sans JP の後に Inter が来るように調整
        sans: ['Inter', '"Noto Sans JP"', 'sans-serif'], // 英数字はInter, 日本語はNoto Sans JP, フォールバックは標準のサンセリフ
        serif: ['Merriweather', 'serif'], // セリフ体はそのまま
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // typographyプラグインは維持
  ],
}