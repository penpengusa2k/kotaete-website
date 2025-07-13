<template>
  <div :style="{
    backgroundColor: '#1a1a1a',
    width: '100%',
    height: '100%',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px',
    fontSize: '36px',
    fontFamily: 'Noto Sans JP',
    backgroundImage: 'linear-gradient(to bottom right, #6b0f1a, #b91372)',
  }">
    <h1 :style="{ fontSize: '64px', marginBottom: '20px' }">なんちゃって関係診断</h1>
    <p>{{ name1 || 'あなた' }} × {{ name2 || 'あの人' }}</p>
    <div :style="{ fontSize: '28px', marginTop: '30px' }">
      <p>💖 恋愛：{{ love || '未診断' }}</p>
      <p>🤝 友情：{{ friendship || '未診断' }}</p>
      <p>💼 仕事：{{ work || '未診断' }}</p>
    </div>
    <p :style="{ marginTop: '40px', fontSize: '20px' }">#なんちゃって関係診断</p>
  </div>
</template>

<script setup>
// Noto Sans JPフォントを読み込む
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap',
    },
  ],
})

defineProps({
  name1: String,
  name2: String,
  love: String,
  friendship: String,
  work: String,
});
</script>
