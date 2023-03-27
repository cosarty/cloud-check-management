<template>
  <div style="background-color: white; height: 100%">学生班级</div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '班级',
  icon: 'icon-xuesheng',
  name: 'teacherClass',
  auth: 'teacher',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts"></script>

<style scoped></style>
