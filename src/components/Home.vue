<template>
  <div>home</div>
  <div>{{ user.name }}</div>

  <img src="@/assets/svg/login-bg.svg">
</template>

<script setup lang="ts">
import userStore from '@/store/userStore';

const user = userStore()
</script>

<style scoped></style>
