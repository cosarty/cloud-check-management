<template>
  <div v-loading="mapLoading" style="width: 100%; height: 100%">
    <div id="allmap"></div>
  </div>
</template>

<script setup lang="ts">
import useMap from '@/hooks/userMap/index'

const { loadScript, mapLoading, loadCurrentLocal } = useMap()

onMounted(async () => {
  await nextTick()
  loadScript().then(async () => {
    await loadCurrentLocal()
  })
})
</script>

<style scoped lang="scss">
#allmap {
  // 注意给dom宽高，不然地图不出来
  width: inherit;
  height: inherit;
  position: relative;
}
</style>
