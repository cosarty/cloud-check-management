<template>
  <div style="background-color: white; height: 100%" class="box-border">
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '课程',
  icon: 'icon-kecheng',
  name: 'course',
  auth: ['admin', 'super', 'teacher'],
  orderNo: 12,
  redirect: 'courseMange',
})
</script>
<script setup lang="ts">
/**
 *   管理员 超级管理员 老师共享这个页面
 *
 *   管理员和超级管理员和管理课程
 *
 *    老师可以创建课程
 */
</script>

<style scoped lang="scss"></style>
