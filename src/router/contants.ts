import { RouteRecordRaw } from 'vue-router'

const contantsRouter: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/Home.vue'),
  },
]

export default contantsRouter
