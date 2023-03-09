<template>
  <div class="sider-bar">
    <div class="sider-bar__title">{{ prentRouteTitle }}</div>
    <div class="sider-bar__content">
      <RouterLink
        :to="{ name: route.name }"
        v-for="(route, index) in children"
        :key="index"
        custom
        v-slot="{ navigate, isActive }"
      >
        <div
          @click="navigate"
          class="sider-bar__item"
          :class="{ active: isActive }"
        >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gailan"></use>
          </svg>
          <span class="sider-bar__item--title">{{ getTitle(route) }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRouteTitle } from '@/utils/utils'
import { RouteRecordRaw } from 'vue-router'

defineProps<{ children: RouteRecordRaw[]; prentRouteTitle: string }>()

/**@description 获取标题 */
const getTitle = (route: RouteRecordRaw) => getRouteTitle(route)
</script>

<style scoped lang="scss">
@import 'index';
</style>
