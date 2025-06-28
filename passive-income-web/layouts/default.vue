<template>
  <div class="flex flex-col min-h-screen font-sans text-gray-800">
    <AppHeader />

    <main class="flex-grow">
      <slot /> </main>

    <AppFooter />
  </div>
</template>

<script setup>
// AppHeader や AppFooter は自動インポートされるため、
// ここで明示的に import 文を書く必要は通常ありませんが、
// もし書いている場合はパスが正しいか確認してください。
</script>

<style>
body {
  @apply bg-gray-50;
}
</style>