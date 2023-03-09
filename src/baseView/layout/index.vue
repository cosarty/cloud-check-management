<template>
  <ElContainer class="layout">
    <Navbar />
    <ElContainer class="continer">
      <Sidebar />
      <ElContainer class="content-bg">
        <ElHeader class="content-header">
          <ElBreadcrumb>
            <ElBreadcrumbItem :to="{ path: '/admin' }">homepage</ElBreadcrumbItem>
            <ElBreadcrumbItem :to="{ path: '/' }">promotion management</ElBreadcrumbItem>
          </ElBreadcrumb>
        </ElHeader>
        <ElMain class="main">
          <ElScrollbar>
            <slot></slot>
          </ElScrollbar>
        </ElMain>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import Sidebar from './sidebar/index.vue'
import Navbar from './navbar/index.vue'
</script>

<style scoped lang="scss">
@import 'index';
</style>
 