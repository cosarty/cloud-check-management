<template>
  <RouterView></RouterView>
</template>
<script lang="ts">
export default defineComponent({
  title: '学生',
  icon: 'icon-xuesheng',
  name: 'student',
  auth: ['admin', 'super'],
  redirect: 'mange',
})
</script>
<script setup lang="ts"></script>

<style scoped></style>
