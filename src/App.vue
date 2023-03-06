<template>
  <RouterView v-slot="{ Component, route }">
    <component :is="Component" v-if="route.meta.hideLayout" />
    <Layout v-else><component :is="Component" /></Layout>
  </RouterView>
</template>

<script setup lang="ts">
import Layout from '@/baseView/layout/index.vue'
</script>

<style scoped lang="scss"></style>
