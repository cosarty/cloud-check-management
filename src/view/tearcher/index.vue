<template>
  <div>
    教室界面
    <RouterView />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  auth: 'teacher',
  redirect:'class'
})
</script>

<script setup lang="ts">

</script>

<style scoped>

</style>