<template>
  <slot :show="show"></slot>
  <el-dialog v-model="dialogVisible" :title="studentName" width="30%">
    <span>This is a message</span>


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

const dialogVisible = ref(false)

const isStudent = ref(true)
const studentId = ref()
const studentName = ref('')

const show =async (id: any, name: any,classId:any, auth: any) => {
  console.log('classId: ', classId);
  studentId.value = id
  studentName.value = name
  dialogVisible.value = true
  isStudent.value = auth

 const data =  await getSduentStat({classScheduleId:classId,userId:id})
 console.log('data: ', data);
}

watch(dialogVisible, nv => {
  if (!nv) {
    nextTick(() => {
      studentId.value = undefined
      studentName.value = ''
      isStudent.value = true
    })
  }
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
