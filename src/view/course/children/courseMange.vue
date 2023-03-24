<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 px-10">
      <AddCourse title="添加课程" #default="{ updateVisBale }">
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
    <div class="p-4 px-10 bg-slate-100 h-full">课程列表</div>
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
import { Plus, Search } from '@element-plus/icons-vue'
import AddCourse from './components/AddCourse.vue'

const searchText = ref('')
</script>

<style scoped></style>
