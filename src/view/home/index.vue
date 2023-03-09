<template>
  <div>
  {{ user.userInfo.auth }} 首页
  </div>
</template>
<script lang="ts">
export default defineComponent({
  title: '首页',
})
</script>
<script setup lang="ts">
import userStore from '@/store/userStore';

const user = userStore()
</script>

<style scoped lang="scss"></style>