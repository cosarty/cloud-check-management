<template>
  <div v-if="!isHistory">
    <div class=" mb-3">
      <SendTask>
        <MapPopUp ref="mapRef" title="选择位置" id="allmap" @confirm="add" is-scope>
          <template #extra="{ toggle }">
            <el-button @click="toggle" type="primary">
              发起签到
            </el-button>
          </template>
        </MapPopUp>

      </SendTask>
    </div>
    <div>
      <el-card class=" mb-6">
        <template #header>
          <div class=" text-green-700 text-lg font-bold">
            签到中
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
      </el-card>
      <el-card>
        <template #header>
          <div class=" text-yellow-700 text-lg font-bold">
            待签到
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
      </el-card>
    </div>
  </div>
  <div v-else>
    查看历史
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ isHistory: boolean }>()
const mapRef = ref<any>()
const tableRef = ref<any>()

const add = async (data: any) => {
  data.location = JSON.stringify(data.location)
  tableRef.value.reset()
}
</script>

<style scoped lang="scss"></style>