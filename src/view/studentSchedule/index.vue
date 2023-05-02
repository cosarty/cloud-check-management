<template>

  <ClassStatInfo :class-id="classId"></ClassStatInfo>
</template>
<script lang="ts">
export default defineComponent({
  title: '班级',
  icon: 'icon-jiaoshilaoshi',
  name: 'studentSchedule',
  auth: ['student'],
})
</script>
<script setup lang="ts">
import { getUsersClass } from '@/http/api';
import userStore from '@/store/userStore';
import ClassStatInfo from '@/components/ClassStatInfo.vue'
const user = userStore()
const classId = computed(() => user.userInfo.classId)



/**
 *   按照班级来统计
*   1.班级同学
    2.按课程统计
    3.  如果有选择同学的话还可以看到统计表
       积分版
 */

</script>

<style scoped></style>
