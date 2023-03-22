<template>
  <div style="background-color: white; height: 100%">班级管理</div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '班级',
  icon: 'icon-xuesheng',
  name: 'class',
  auth: 'teacher',
})
</script>
<script setup lang="ts"></script>

<style scoped></style>
