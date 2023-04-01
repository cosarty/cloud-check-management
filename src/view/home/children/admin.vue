<template>
  <MapPopUp title="选择位置" id="allmap" @confirm="test">
    <template #extra="{ toggle }">
      <el-button @click="toggle"> 选择位置 </el-button>
    </template>
  </MapPopUp>
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
import MapPopUp from '@/components/BdMap/MapPopUp.vue'
// var a = ['114.066392,22.748699', '114.07991,22.640074']

const test = (data: any) => {
  console.log('data: ', data)
}
</script>

<style lang="scss" scoped></style>
