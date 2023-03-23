<template>
  <RouterView></RouterView>
</template>
<script lang="ts">
export default defineComponent({
  title: '教师',
  icon: 'icon-jiaoshilaoshi',
  name: 'teacher',
  auth: ['admin', 'super'],
  redirect: 'teacherMange',
})
</script>
<script setup lang="ts"></script>

<style scoped></style>
