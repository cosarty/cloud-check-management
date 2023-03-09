<template>
  <ElAside class="aside" :style="setWidthVar">
    <div class="menu">
      <MenuItem
        :menu-route="route"
        v-for="(route, idx) in routerList"
        :key="idx"
      />
    </div>
    <Transition name="fead-sidebar" mode="out-in">
      <SidebarItem
        v-if="children.length"
        :children="children"
        :prent-route-title="prentRouteTitle"
      />
    </Transition>
  </ElAside>
</template>

<script lang="ts">
export default defineComponent({
  name: 'siderBar',
})
</script>

<script setup lang="ts">
import menuStore from '@/store/menuStore'
import { CSSProperties } from 'vue'
import MenuItem from './menuItem/index.vue'
import SidebarItem from './sidebarItem/index.vue'
const menu = menuStore()
const route = useRoute()
const prentRouteTitle = ref<string>('')
const children = computed(() => {
  const regx = /(?<=^\/)[^\/]+/g
  const name = route.fullPath.match(regx)
  if (!name || name[0] === 'forbidden') {
    prentRouteTitle.value = ''
    return []
  }
  const prent = (menu.menuRoute ?? []).find(r => r.name === name[0])
  prentRouteTitle.value = prent?.meta?.title ?? name[0]
  return prent?.children ?? []
})
// const $router = routerStore()

const setWidthVar = computed<CSSProperties>(() => ({
  ['--base-siderbat-width']: children.value.length > 0 ? '140px' : '0px',
}))

const routerList = computed(() => menu.menuRoute)

watch(route, newRoute => {
  menu.addTab(newRoute)
})
</script>

<style scoped lang="scss">
@import 'index';
</style>
