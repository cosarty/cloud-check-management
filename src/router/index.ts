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
NProgress.configure({ showSpinner: false })
// const view = import.meta.glob(['@/view/**/*.vue', '!@/view/**/sys'], {
//   eager: true,
// })
// console.log('view: ', view)

export const cteateRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [...contantsRouter],
  })

  return router
}

export const setupRouterGuard = (router: Router) => {
  router.beforeEach(
    async (to: RouteLocationNormalized, form: RouteLocationNormalized) => {
      NProgress.start()
      // 判断token是否存在
      if (userStore().token) {
        // 判断pinia中是否存储了用户信息  如果存储了就跳过
        const user = userStore().userInfo

        // 如果用户不存在就尝试获取用户，获取不到就跳转到登录页
        if (!user) {
          console.log('user: ', user)
          await userStore().getUserInfo()

          console.log('user: ', user)

          if (!user) return '/login'
        }

        if (to.path === '/login') return '/'
      } else {
        return { path: 'login' }
      }

      return
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

