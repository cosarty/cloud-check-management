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
      <SidebarItem v-if="children.length" :children="children" />
    </Transition>
  </ElAside>
</template>

<script lang="ts">
export default defineComponent({
  name: 'siderBar',
})
</script>

<script setup lang="ts">
import routerStore from '@/store/routerStore'
import { CSSProperties } from 'vue'
import MenuItem from './menuItem/MenuItem.vue'
import SidebarItem from './sidebarItem/SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const children = computed(() => {
  const regx = /(?<=^\/)[^\/]+/g
  const name = route.fullPath.match(regx)
  if (!name || name[0] === 'forbidden') return []
  return $router.userRouter.find(r => r.name === name[0])?.children ?? []
})
const $router = routerStore()

const setWidthVar = computed<CSSProperties>(() => ({
  ['--base-siderbat-width']: children.value.length > 0 ? '160px' : '0px',
}))

const routerList = computed(() => $router.userRouter)
</script>

<style scoped lang="scss">
@use 'index' as *;
</style>
