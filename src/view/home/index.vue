<template>
  <div style="background-color: white; padding: 0.3rem">
    <div>{{ user.userInfo.auth }} 首页</div>
  
  </div>
</template>
<script lang="ts">
export default defineComponent({
  title: '首页',
  orderNo: -1,
  icon: 'icon-shouye',
  name:'home'
})
</script>
<script setup lang="ts">
import userStore from '@/store/userStore'

const user = userStore()
</script>

<style scoped lang="scss"></style>
