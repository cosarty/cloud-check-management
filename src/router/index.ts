import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: () => import('@/components/Home.vue') }],
})

router.onError(err => {
  console.log('err: ', err)
})

export default router
