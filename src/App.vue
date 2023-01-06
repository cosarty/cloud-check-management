<script setup lang="ts">
const count = ref(0)
console.log(import.meta.env.VITE_APP_API_BASE_URL)
</script>

<template>
  {{ count }}
  <ElButton type="primary" @click="count++"> 点击 </ElButton>

  <button class="p-2 m-2 bg-blue-800 rounded-3xl text-red-600 shadow-xl">
    BUTTON
  </button>
</template>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
