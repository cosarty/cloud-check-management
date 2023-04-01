<template>
  <BdMap />
</template>

<script lang="ts">
export default defineComponent({
  auth: 'admin',
  name: 'admin',
  hideMenu: true,
  coverRouter: true,
})
</script>

<script setup lang="ts">
import BdMap from '@/components/BdMap/BdMap.vue'
// var a = ['114.066392,22.748699', '114.07991,22.640074']
</script>

<style lang="scss" scoped></style>
