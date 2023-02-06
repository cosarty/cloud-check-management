import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

router.onError(err => {
  console.log('err: ', err)
})

export default router
