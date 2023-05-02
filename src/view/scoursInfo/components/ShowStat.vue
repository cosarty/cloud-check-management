<template>
  <slot :show="show"></slot>
  <el-dialog v-model="dialogVisible" :title="stattName" width="30%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="已签到" name="1">
        <div class="h-72">
          <ElScrollbar>
            <StudentItme :data="statInfo['1']" :action="1" @click="setAction" />
          </ElScrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="迟到" name="0">
        <div class="h-72">
          <ElScrollbar>
            <StudentItme :data="statInfo['0']" :action="0" @click="setAction" />
          </ElScrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未签到" name="2">
        <div class="h-72">
          <ElScrollbar>
            <StudentItme :data="statInfo['2']" :action="2" @click="setAction" />
          </ElScrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 显示某一次签到的信息
import { getSduentStat, getSingStat, setStatType } from '@/http/api'

import StudentItme from './StudentItem.vue'


const emits = defineEmits<{ (e: 'update'): void }>()

const dialogVisible = ref(false)
const statInfo = ref<any>({ 0: [], 1: [], 2: [] })

const classScheduleId = ref()
const singTaskId = ref()
const stattName = ref('')
const activeName = ref('1')
const show = async (id: any, name: any, cid: any) => {

  classScheduleId.value = cid
  singTaskId.value = id
  stattName.value = name

  await getData()
  dialogVisible.value = true
}


const setAction = async (action: number, userId: any, statId: any) => {
  await setStatType({ action, userId, statId, singTaskId: singTaskId.value, classScheduleId: classScheduleId.value })
  await getData()
  emits('update')
}


const getData = async () => {
  const { data } = await getSingStat({ singTaskId: singTaskId.value })

  // 
  statInfo.value = data
}

watch(dialogVisible, nv => {
  if (!nv) {
    nextTick(() => {
      statInfo.value = { 0: [], 1: [], 2: [] }
      activeName.value = '1'
      classScheduleId.value = undefined
      singTaskId.value = undefined
    })
  }
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
