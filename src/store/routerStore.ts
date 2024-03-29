import { forbiddenRouter, WHITE_NAME_LIST } from '@/router/baseRouter'
import router from '@/router'
import { getDynamicRouter } from '@/router/dynamicLoadView'
import menuStore from './menuStore'
import { RouteRecordRaw } from 'vue-router'
const routerStore = defineStore('router', () => {
  // 获取根路由
  // const router = useRouter()

  const isBuildRouter = ref<boolean>(false)
  const userRouter = ref<RouteRecordRaw[]>([])
  const menu = menuStore()
  // 判断权限
  const hasPermission = (routeAuth: string[], userAuth: string[]): boolean => {
    return routeAuth.some(ra => userAuth.includes(ra))
  }

  // 过滤权限路由
  const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: any) => {
    const res: RouteRecordRaw[] = []
    for (const route of routes) {
      let routeAuth = route.meta?.auth
      if (routeAuth) {
        routeAuth = Array.isArray(routeAuth) ? routeAuth : [routeAuth]
        roles = Array.isArray(roles) ? roles : [roles]
        // 判断路由权限
        if (hasPermission(routeAuth, roles)) {
          res.push({
            ...route,
            children: filterAsyncRoutes(route.children ?? [], roles),
          })
        }
        continue
      }
      res.push(route)
    }

    return res
  }

  // 构建路由
  const buildRoute = async (auth: string[]) => {
    const dynamicRouter = getDynamicRouter()

    const asyncRouter = filterAsyncRoutes(dynamicRouter, auth)
    for (const route of [...asyncRouter, ...forbiddenRouter]) {
      router.addRoute(route)
    }

    isBuildRouter.value = true
    userRouter.value = asyncRouter
    // 构建菜单
    await menu.generateRoute([...asyncRouter])
  }

  // 重置路由
  const resetRouter = () => {
    userRouter.value = []
    isBuildRouter.value = false
    menu.clearMenu()
    router.getRoutes().forEach(route => {
      const { name } = route
      if (name && !WHITE_NAME_LIST.includes(name as string)) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  }

  return { buildRoute, resetRouter, isBuildRouter, userRouter }
})

export default routerStore
