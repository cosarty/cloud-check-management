<template>
  <div style="background-color: white; height: 100%">
    <div class="m-4 flex justify-between">
      <div class="font-bold text-lg">课程列表</div>
      <ElButton type="primary">查看课表</ElButton>
    </div>
    <div><RenderCourse :data="courseList" @action="showScourse" /></div>
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
const router = useRouter()
const courseList = ref<any>([])
onMounted(() => {
  getStudentClass().then(({ data }) => {
    courseList.value = data.map(({ class: cls, ...res }: any) => ({
      ...res,
      ClassSchedule: cls?.[0]?.ClassSchedule,
    }))
  })
})

const showScourse = (comd: string, data: any) => {
  if (comd === 'show') {
    router.push({
      name: 'scoursInfo',
      query: { courseId: data.ClassSchedule.classScheduleId },
    })
  }
}
</script>

<style scoped></style>
