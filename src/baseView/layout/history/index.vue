<template>
  <ElHeader class="content-header" v-if="menu.tabList.length">
    <div class="history-content">
      <RouterLink
        :to="{name:ro.name!}"
        v-for="ro in menu.tabList"
        :key="ro.fullPath"
        custom
        v-slot="{ navigate, isActive }"
      >
        <div
          class="history-link"
          @click="navigate"
          :class="{ active: isActive }"
        >
          {{ getRouteTitle(ro) }}
          <ElIcon
            @click.stop="menu.closeTag(ro, $route, $router.replace)"
            :size="16"
            style="margin-left: 0.4rem"
          >
            <CircleClose />
          </ElIcon>
        </div>
      </RouterLink>
    </div>
  </ElHeader>
</template>

<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue'
import menuStore from '@/store/menuStore'
import { getRouteTitle } from '@/utils/utils'
const menu = menuStore()
</script>

<style scoped lang="scss">
@import 'index';
</style>
