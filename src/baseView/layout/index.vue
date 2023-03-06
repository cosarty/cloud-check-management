<template>
  <ElContainer class="layout">
    <ElHeader class="header"></ElHeader>
    <ElContainer class="continer">
      <ElAside class="aside"></ElAside>
      <ElContainer class="continer">
        <ElMain class="main"> laout<slot></slot></ElMain>
        <ElFooter class="footer">底部</ElFooter>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use 'index' as *;
</style>
