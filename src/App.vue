<template>
  <RouterView v-slot="{Component}">
   <component :is="Component" />
  </RouterView>
</template>

<script setup lang="ts">


</script>

<style scoped lang="scss">

</style>
