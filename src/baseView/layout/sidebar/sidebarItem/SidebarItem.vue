<template>
  <div class="sider-bar">{{ children[0].name }}</div>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'

defineProps<{ children: RouteRecordRaw[] }>()
</script>

<style scoped lang="scss">
@use 'SidebarItem' as *;
</style>
