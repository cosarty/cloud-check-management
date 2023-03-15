<template>
  <ElContainer class="layout">
    <Navbar />
    <ElContainer class="continer">
      <Sidebar />
      <ElContainer class="content-bg" style="flex-direction: column">
        <History />
        <ElMain class="main">
          <!-- <ElScrollbar> -->
          <slot></slot>
          <!-- </ElScrollbar> -->
        </ElMain>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import Sidebar from './sidebar/index.vue'
import Navbar from './navbar/index.vue'
import History from './history/index.vue'
</script>

<style scoped lang="scss">
@import 'index';
</style>
