<template>
  <div v-if="!isHistory">
    <div class=" mb-3">
      <SendTask>
        <el-button type="primary">
          创建签到
        </el-button>
      </SendTask>
    </div>
    <div>
      <el-card class=" mb-6">
        <template #header>
          <div class=" flex justify-between px-4 items-center">
            <div class=" text-green-700 text-lg font-bold">
              签到中
            </div>
            <el-icon size="25" class=" cursor-pointer">
              <RefreshLeft />
            </el-icon>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div> 
      </el-card>
      <el-card>
        <template #header>
          <div class=" flex justify-between px-4 items-center">
            <div class=" text-yellow-700 text-lg font-bold">
              待签到
            </div>
            <el-icon size="25" class=" cursor-pointer">
              <RefreshLeft />
            </el-icon>
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

import { RefreshLeft } from '@element-plus/icons-vue'
const props = defineProps<{ isHistory: boolean }>()

const tableRef = ref<any>()


</script>

<style scoped lang="scss"></style>