<template>
  <RouterView v-slot="{ Component, route }">
    <suspense @resolve="resolve">
      <template #default>
        <component :is="Component" v-if="route.meta.hideLayout" />
        <Layout v-else>
          <component :is="Component" />
        </Layout>
      </template>
    </suspense>
  </RouterView>
</template>

<script setup lang="ts">
import Layout from '@/baseView/layout/index.vue'
import { ElLoading } from 'element-plus';

const loadingInstance = ElLoading.service({
  background: 'rgba(255,255,255,.5)',
})

const resolve = () => {
  loadingInstance.close()
}
</script>

<style scoped lang="scss">

</style>
