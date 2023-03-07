<template>

  <div>{{ user.userInfo }}</div>
  <ElButton @click="user.logout()">退出登录 </ElButton>
  <FooterBar></FooterBar>
</template>

<script setup lang="ts">
import userStore from '@/store/userStore'
import FooterBar from '@/components/FooterBar.vue'

const user = userStore()
</script>

<style scoped></style>
