<template>
  <ElContainer class="layout">
    <ElHeader class="header"></ElHeader>
    <ElContainer class="continer">
      <ElAside class="aside"></ElAside>
      <ElContainer class="continer content-bg">
        <ElHeader class="content-header">
          <ElBreadcrumb >

            <ElBreadcrumbItem :to="{ path: '/' }">homepage</ElBreadcrumbItem>
            <ElBreadcrumbItem :to="{ path: '/' }">promotion management</ElBreadcrumbItem>
          </ElBreadcrumb>
        </ElHeader>
        <ElMain class="main">
          <div class="main-box">
            <ElScrollbar>
              <div> laout<slot></slot>
              </div>
            </ElScrollbar>
          </div>
        </ElMain>

        <ElFooter class="footer">底部</ElFooter>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use 'index' as *;
</style>
