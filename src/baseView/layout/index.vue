<template>
  <ElContainer class="layout">
    <ElHeader class="header"></ElHeader>
    <ElContainer class="continer">
      <Sidebar />
      <ElContainer class="content-bg">
        <ElHeader class="content-header">
          <ElBreadcrumb>
            <ElBreadcrumbItem :to="{ path: '/admin' }"
              >homepage</ElBreadcrumbItem
            >
            <ElBreadcrumbItem :to="{ path: '/' }"
              >promotion management</ElBreadcrumbItem
            >
          </ElBreadcrumb>
        </ElHeader>
        <ElMain class="main">
          <!-- <div class="main-box"> -->
          <ElScrollbar>
            <slot></slot>
          </ElScrollbar>
          <!-- </div> -->
        </ElMain>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import Sidebar from './sidebar/index.vue'
</script>

<style scoped lang="scss">
@import 'index';
</style>
 