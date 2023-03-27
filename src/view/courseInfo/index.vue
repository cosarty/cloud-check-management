<template>
  <div style="background-color: white; height: 100%">签到信息</div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '签到信息',
  icon: 'icon-xuesheng',
  name: 'courseInfo',
  auth: ['teacher', 'student'],
  hideMenu: true,
})
</script>
<script setup lang="ts"></script>

<style scoped></style>
