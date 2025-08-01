<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col pb-20 md:pb-0">
    <Header />
    <main class="w-full bg-white p-6 sm:p-8 rounded-xl shadow-2xl mt-24 flex-grow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtPage />
      </div>
    </main>
    <Footer />
    <MobileNav />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
import MobileNav from '~/components/MobileNav.vue';
</script>
