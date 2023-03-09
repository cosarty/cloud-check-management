<template>
  <div style="box-sizing: border-box; padding: 15px">
    <div>{{ user.userInfo }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>

    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>

    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>
    <div>{{ user }}</div>

    <ElButton @click="user.logout()">退出登录 </ElButton>
    <FooterBar></FooterBar>
  </div>
</template>

<script setup lang="ts">
import userStore from '@/store/userStore'
const user = userStore()
</script>

<style scoped>
div {
  word-wrap: break-word;
}
</style>
