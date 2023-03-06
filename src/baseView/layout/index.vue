<template>
  <ElContainer class="layout">
    <ElHeader class="header"></ElHeader>
    <ElContainer class="continer">
      <ElAside class="aside"></ElAside>
      <ElContainer class="continer">
        <ElMain class="main">
          <ElBreadcrumb style="margin-bottom: 20px">
            <ElBreadcrumbItem :to="{ path: '/' }">homepage</ElBreadcrumbItem>
            <ElBreadcrumbItem :to="{ path: '/' }"
              >promotion management</ElBreadcrumbItem
            >
          </ElBreadcrumb>
          <div class="main-box">laout<slot></slot></div
        ></ElMain>
        <!-- <ElFooter class="footer">底部</ElFooter> -->
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use 'index' as *;
</style>
