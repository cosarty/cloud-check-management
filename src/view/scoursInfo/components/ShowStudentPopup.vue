<template>
  <slot :show="show"></slot>
  <el-dialog v-model="dialogVisible" :title="studentName" width="30%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="已签到" name="1">
        <div class="h-72">
          <ElScrollbar>
            <StatItem :data="statInfo['1']" :is-student="isStudent" :action="1" />
          </ElScrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="迟到" name="0">
        <div class="h-72">
          <ElScrollbar>
            <StatItem :data="statInfo['0']" :action="0" :is-student="isStudent" />
          </ElScrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未签到" name="2">
        <div class="h-72">
          <ElScrollbar>
            <StatItem :data="statInfo['2']" :action="2" :is-student="isStudent" />
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
import { getSduentStat } from '@/http/api'

import StatItem from './StatItem.vue'
const dialogVisible = ref(false)
const statInfo = ref<any>({ 0: [], 1: [], 2: [] })
const isStudent = ref(true)
const studentId = ref()
const studentName = ref('')
const activeName = ref('1')
const show = async (id: any, name: any, classId: any, auth: any) => {
  console.log('classId: ', classId)
  studentId.value = id
  studentName.value = name
  dialogVisible.value = true
  isStudent.value = auth

  const { data } = await getSduentStat({ classScheduleId: classId, userId: id })
  console.log('data: ', data)
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
    })
  }
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
