<template>
  <div style="background-color: white; height: 100%">
    <RenderClassList :class-list="classList" />
  </div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '班级',
  icon: 'icon-xuesheng',
  name: 'teacherClass',
  auth: 'teacher',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts">
import { getTeacherClass } from '@/http/api'
import RenderClassList from './components/RenderClassList.vue'
const classList = ref<any>([])

onMounted(() => {
  getTeacherClass().then(({ data }) => {
    console.log('data: ', data)
    classList.value = data
  })
})
</script>

<style scoped lang="scss"></style>
