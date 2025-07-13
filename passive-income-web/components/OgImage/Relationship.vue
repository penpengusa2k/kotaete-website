<template>
  <div :style="{
    backgroundColor: '#1a1a1a',
    width: '100%',
    height: '100%',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontSize: '36px',
    fontFamily: 'Noto Sans JP',
    backgroundImage: 'linear-gradient(to bottom right, #6b0f1a, #b91372)',
  }">
    <h1 :style="{ fontSize: '48px', marginBottom: '30px' }">地獄の関係相性チェッカー</h1>
    <div :style="{ display: 'flex', alignItems: 'center', fontSize: '42px', marginBottom: '30px' }">
      <span>{{ name1 || 'あなた' }}</span>
      <span :style="{ margin: '0 20px' }">×</span>
      <span>{{ name2 || 'あの人' }}</span>
    </div>
    <div :style="{ fontSize: '80px', fontWeight: 'bold', color: '#ffc107' }">
      総合相性: {{ compatibility || 0 }}%
    </div>
    <p :style="{ marginTop: '40px', fontSize: '24px' }">#なんちゃって関係診断</p>
  </div>
</template>

<script setup>
defineProps({
  name1: String,
  name2: String,
  compatibility: String,
});
</script>
