<template>
  <div>home</div>
  <div>{{ user.userInfo }}</div>
   <ElButton @click="user.logout()">退出登录 </ElButton>
  <img src="@/assets/svg/login-bg.svg">
</template>

<script setup lang="ts">
import userStore from '@/store/userStore';

const user = userStore()
</script>

<style scoped></style>
