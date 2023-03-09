<template>
  <RouterLink :to="{ name: menuRoute.name }" v-slot="{ href, navigate ,isActive }" custom>
    <a class="menu-item" :href="href" @click="navigate" :class="{active:isActive}">
      <div>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gailan"></use>
        </svg>
      </div>
      <div class="menu-title">{{ title }}</div>
    </a>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'

const props = defineProps<{ menuRoute: RouteRecordRaw }>()

/**@description 获取标题 */
const title = computed(() => {
  const { meta: { title } = {}, name } = props.menuRoute
  return title || name
})
</script>

<style scoped lang="scss">
@import 'index' ;
</style>
