<template>
  <ElAside class="aside">
    <div class="menu">
        <MenuItem :menu-route="route"  v-for="(route, idx) in router" :key="idx"  />
    </div>
    <SidebarItem />
  </ElAside>
</template>

<script lang="ts">


export default defineComponent({
  name: 'siderBar'
})
</script>

<script setup lang="ts">
import routerStore from '@/store/routerStore';
import MenuItem from './menuItem/MenuItem.vue'
import SidebarItem from './sidebarItem/SidebarItem.vue'



const $router = routerStore()

const router = computed(() => $router.userRouter)

</script>

<style scoped lang="scss">
@use 'index' as *
</style>