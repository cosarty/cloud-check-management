<template>
  <ElConfigProvider :locale="zhCn">
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" v-if="route.meta.hideLayout" />
      <Layout v-else>
        <!-- <Transition name="fead-test" mode="out-in"> -->
        <KeepAlive :include="menu.cacheTabList">
          <component :is="Component" />
        </KeepAlive>
        <!-- </Transition> -->
      </Layout>
    </RouterView>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import Layout from '@/baseView/layout/index.vue'
import menuStore from './store/menuStore'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const menu = menuStore()
</script>

<style scoped lang="scss"></style>
