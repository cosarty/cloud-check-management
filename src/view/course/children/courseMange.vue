<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 px-10">
      <AddCourse @reset="reset" title="添加课程" #default="{ updateVisBale }">
        <ElButton :icon="Plus" @click="updateVisBale">添加课程</ElButton>
      </AddCourse>
      <ElInput
        v-model="searchText"
        placeholder="搜索"
        style="width: 16rem"
        :prefix-icon="Search"
        clearable
      />
    </div>
    <ElScrollbar class="p-4 bg-slate-100 h-full">
      <RenderCourse :data="courseList" />
    </ElScrollbar>
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
import { getCourseList } from '@/http/api'
import userStore from '@/store/userStore'
import { Plus, Search } from '@element-plus/icons-vue'
import AddCourse from './components/AddCourse.vue'
import RenderCourse from '@/components/RenderCourse/index.vue'
const user = userStore()
const searchText = ref('')
const courseList = ref<any>([])
const reset = async () => {
  const { data } = await getCourseList()
  courseList.value = data.rows
}

onMounted(() => {
  reset()
})
</script>

<style scoped></style>
