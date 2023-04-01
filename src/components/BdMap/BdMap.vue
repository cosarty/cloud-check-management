<template>
  <div
    v-loading="loading"
    style="width: 100%; height: 100%"
    element-loading-text="定位中"
  >
    <div :id="id" class="map"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ loading: boolean; id: string }>()
</script>

<style scoped lang="scss">
.map {
  // 注意给dom宽高，不然地图不出来
  width: inherit;
  height: inherit;
  position: relative;
}
</style>
