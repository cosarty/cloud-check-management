import { RouteRecordRaw } from 'vue-router'

const menuStore = defineStore('menu', () => {
  const menuRoute = ref<RouteRecordRaw[]>()

  const stortRoute = (route: RouteRecordRaw[]) => {
    // 先排序子项，再排序父项
    for (const r of route) {
      if (r?.children!.length > 0) {
        stortRoute(r?.children!)
      }
    }
    return route.sort((a, b) => {
      return (a.meta?.orderNo ?? 999) - (b.meta?.orderNo ?? 999)
    })
  }

  const generateRoute = async (route: RouteRecordRaw[]) => {
    stortRoute(route)

    menuRoute.value = [...route]
  }

  const clearMenu = () => {
    menuRoute.value = undefined
  }
  return { menuRoute, generateRoute, clearMenu }
})

export default menuStore
