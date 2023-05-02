<template>
  <slot :show="show"></slot>
  <el-dialog v-model="dialogVisible" :title="studentName" width="30%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="已签到" name="1">
        <div class="h-72">
          <ElScrollbar>
            <StatItem :data="statInfo['1']" :is-student="isStudent" :action="1" @click="setAction" />
          </ElScrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="迟到" name="0">
        <div class="h-72">
          <ElScrollbar>
            <StatItem :data="statInfo['0']" :action="0" :is-student="isStudent" @click="setAction" />
          </ElScrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未签到" name="2">
        <div class="h-72">
          <ElScrollbar>
            <StatItem :data="statInfo['2']" :action="2" :is-student="isStudent" @click="setAction" />
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
import { getSduentStat, setStatType } from '@/http/api'

import StatItem from './StatItem.vue'


const emits = defineEmits<{ (e: 'update'): void }>()

const dialogVisible = ref(false)
const statInfo = ref<any>({ 0: [], 1: [], 2: [] })
const isStudent = ref(true)
const studentId = ref()
const classScheduleId = ref()
const studentName = ref('')
const activeName = ref('1')
const show = async (id: any, name: any, classId: any, auth: any) => {
  classScheduleId.value = classId
  studentId.value = id
  studentName.value = name
  dialogVisible.value = true
  isStudent.value = auth
  await getData()

}


const setAction = async (action: number, statId: any, singTaskId: any) => {
  await setStatType({ action, userId: studentId.value, statId, singTaskId, classScheduleId: classScheduleId.value, })
  await getData()
  emits('update')
}


const getData = async () => {
  const { data } = await getSduentStat({ classScheduleId: classScheduleId.value, userId: studentId.value })

  statInfo.value = data
}

watch(dialogVisible, nv => {
  if (!nv) {
    nextTick(() => {
      studentId.value = undefined
      studentName.value = ''
      isStudent.value = true
      statInfo.value = { 0: [], 1: [], 2: [] }
      activeName.value = '1'
      classScheduleId.value = undefined
    })
  }
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
