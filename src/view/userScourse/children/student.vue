<template>
  <div style="background-color: white; height: 100%">
    <div class="my-4 ml-4 font-bold text-lg">课程列表</div>
    <div><RenderCourse :data="courseList" /></div>
  </div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '课程',
  icon: 'icon-xuesheng',
  name: 'stdentClass',
  auth: 'student',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts">
import RenderCourse from '@/components/RenderCourse/index.vue'
import { getStudentClass } from '@/http/api'
const courseList = ref<any>([])
onMounted(() => {
  getStudentClass().then(({ data }) => {
    courseList.value = data
  })
})
</script>

<style scoped></style>
