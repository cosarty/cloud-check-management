import { RouteRecordRaw } from 'vue-router'

const contantsRouter: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/view/sys/login/index.vue') },
  {
    path: '/404',
    name: '404',
    component: () => import('@/view/sys/404.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/404' },
]

export default contantsRouter
