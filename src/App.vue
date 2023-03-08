<template>
  <RouterView v-slot="{ Component, route }">
    <component :is="Component" v-if="route.meta.hideLayout" />
    <Layout v-else>
      <Transition name="fead-test" mode="out-in">
        <component :is="Component" />
      </Transition>
    </Layout>
  </RouterView>
</template>

<script setup lang="ts">
import Layout from '@/baseView/layout/index.vue'
import { ElLoading } from 'element-plus'
</script>

<style scoped lang="scss">
.fead-test {
  &-enter-active,
  &-leave-active {
    transition: 600ms all ease;
    opacity: 1;
  }

  &-enter-from {
    transform: translateX(30px);
    opacity: 0;
  }

  &-leave-to {
    transform: translateX(-30px);
    opacity: 0;
  }
}
</style>
