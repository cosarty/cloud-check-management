<template>
  <div style="background-color: white; height: 100%" class="box-border">
    {{ courseInfo?.courseName }}
    {{ courseId }}
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '签到详情',
  icon: 'icon-kecheng',
  name: 'scoursInfo',
  auth: ['teacher', 'student'],
  hideMenu: true,
})
</script>
<script setup lang="ts">
import closeCurrentTab from '@/hooks/closeCurrentTab'
import { getCourse } from '@/http/api'
const close = closeCurrentTab()
const route = useRoute()
const courseId = ref<string>('')
const courseInfo = ref<any>({})

watch(
  () => route,
  async nq => {
    if (nq!.name === 'scoursInfo') {
      if (!nq.query?.courseId) {
        close()
        ElMessage.warning('课程id无效')
        return
      }

      if (nq.query?.courseId !== courseId.value) {
        courseId.value = nq.query.courseId as string
        const { data } = await getCourse(nq.query.courseId as string)
        await nextTick()
        courseInfo.value = data
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
