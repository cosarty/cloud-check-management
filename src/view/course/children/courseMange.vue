<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 px-10">
      <AddCourse @reset="reset" title="添加课程" #default="{ updateVisBale }" ref="coursRef">
        <ElButton :icon="Plus" @click="updateVisBale">添加课程</ElButton>
      </AddCourse>
      <ElInput v-model="searchText" placeholder="搜索" style="width: 16rem" :prefix-icon="Search" clearable />
    </div>
    <ElScrollbar class="p-4 bg-slate-100 h-full">
      <RenderCourse :data="courseList" is-action @action="action" show-time />
    </ElScrollbar>
    <IssuedCourse ref="issuedCourseRef" />
  </div>
</template>
<script lang="ts">
export default defineComponent({
  title: '课程管理',
  icon: 'icon-kecheng',
  name: 'courseMange',
  auth: ['admin', 'super', 'teacher'],
  orderNo: 1,
})
</script>
<script setup lang="ts">
import { delteCourse, getCourseList } from '@/http/api'
import userStore from '@/store/userStore'
import { Plus, Search } from '@element-plus/icons-vue'
import AddCourse from './components/AddCourse.vue'
import IssuedCourse from './components/IssuedCourse.vue'
import RenderCourse from '@/components/RenderCourse/index.vue'
import { Action, ElMessageBox } from 'element-plus'
const user = userStore()
const searchText = ref('')
const courseList = ref<any>([])
const coursRef = ref<InstanceType<typeof AddCourse>>()
const issuedCourseRef = ref<InstanceType<typeof IssuedCourse>>()
const reset = async () => {
  const { data } = await getCourseList()
  courseList.value = data.rows
}

const action = (comd: 'update' | 'delete' | 'issued' | 'show', data: any) => {
  switch (comd) {
    case 'update':
      coursRef.value?.updateData?.(data, '编辑课程')
      break
    case 'delete':
      ElMessageBox.confirm('删除之后无法复原', '确认删除该课程', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        callback: (action: Action) => {
          if (action === 'confirm') {
            delteCourse(data.courseId).then(() => {
              reset()
            })
          }
        },
      })
      break
    case 'issued':
      issuedCourseRef.value?.updateData?.(data.courseId)
      break
    case 'show':
      console.log('查看')
      break
  }
}

onMounted(() => {
  reset()
})
</script>

<style scoped></style>
