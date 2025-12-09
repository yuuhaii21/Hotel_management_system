<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <main class="flex-1 p-6 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/sidebar/sidebar.vue'
</script>
