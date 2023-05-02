import {
  createWebHistory,
  createRouter,
  Router,
  RouteLocationNormalized,
} from 'vue-router'
import contantsRouter from './contants'
import userStore from '@/store/userStore'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { baseRouter, forbiddenRouter } from './baseRouter'

import routerStore from '@/store/routerStore'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(),
  routes: [...baseRouter, ...contantsRouter],
})
export const setupRouterGuard = (router: Router) => {
  router.beforeEach(
    async (to: RouteLocationNormalized, form: RouteLocationNormalized) => {
      NProgress.start()
      const user = userStore()
      const $router = routerStore()

      if (!user.token && to.path === '/login') return
      // 判断token是否存在
      if (user.token) {
        // 判断pinia中是否存储了用户信息  如果存储了就跳过
        if (!user.userInfo) {
          // 如果用户不存在就尝试获取用户，获取不到就跳转到登录页
          try {
            await user.getUserInfo()
          } catch {
            return '/login'
          }
        }

        if (!$router.isBuildRouter) {
          await $router.buildRoute([...user.auth,...user.otherAuh])
          return { ...to, replace: true }
        }

        if (to.path === '/login') return '/'

        return
      } else {
        return { path: 'login' }
      }
    },
  )

  router.afterEach(() => {
    NProgress.done()
  })
}

// router.onError(err => {
//   console.log('err: ', err)
// })

export default router
