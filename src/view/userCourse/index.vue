<template>
  <div style="background-color: white; height: 100%">班级管理</div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '班级',
  icon: 'icon-xuesheng',
  name: 'userCourse',
  auth: ['teacher', 'student'],
  isExactActive: false,
  coverRouter: true,
})
</script>
<script setup lang="ts">
import userStore from '@/store/userStore'
import { AuthEnum } from '@/enum/AuthEnum'
const user = userStore()
const router = useRouter()
const route = useRoute()

const currentAuth = ref(user.auth)
/*
 多表查询
 老师的班级
 1. 查询classCchedule下面有哪一些课程属于我的
 2. 然后按照班级分组查询


 学生的班级查询  直接插叙当前班级下边的课程

*/

const comp = computed(() =>
  (currentAuth.value as any).includes('student')
    ? 'stdentClass'
    : 'teacherClass',
)

watch(
  currentAuth,
  newRoute => {
    if (newRoute) {
      router.push({ name: comp.value as any })
    }
  },
  { immediate: true },
)

watch(route, taget => {
  if (taget.name === 'userCourse')
    router.push({
      name: comp.value as any,
    })
})
</script>

<style scoped></style>
