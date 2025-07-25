<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
    <Header />
    <main class="w-full bg-white p-6 sm:p-8 rounded-xl shadow-2xl mt-24 flex-grow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtPage /> <!-- ← slot の代わりにこれが必要！ -->
      </div>
    </main>
    <Footer />
  </div>
</template>
