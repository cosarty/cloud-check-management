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
NProgress.configure({ showSpinner: false })
// const view = import.meta.glob(['@/view/**/*.vue', '!@/view/**/sys'], {
//   eager: true,
// })
// console.log('view: ', view)

export const cteateRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [...baseRouter, ...forbiddenRouter, ...contantsRouter],
  })

  return router
}

export const setupRouterGuard = (router: Router) => {
  router.beforeEach(
    async (to: RouteLocationNormalized, form: RouteLocationNormalized) => {
      NProgress.start()
      const user = userStore()

      if (!user.token && to.path === '/login') return
      // 判断token是否存在
      if (user.token) {
        // 判断pinia中是否存储了用户信息  如果存储了就跳过

        if (!user.userInfo) {
          // 如果用户不存在就尝试获取用户，获取不到就跳转到登录页
          await user.getUserInfo()
          if (!user.userInfo) return '/login'
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

export default cteateRouter()
