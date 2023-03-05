import { createWebHistory, createRouter } from 'vue-router'
import contantsRouter from './contants'



const view  = import.meta.glob(['@/view/**/*.vue','!@/view/**/sys'],{eager:true})
console.log('view: ', view);
const router = createRouter({
  history: createWebHistory(),
  routes: [...contantsRouter],
})

router.onError(err => {
  console.log('err: ', err)
})

export default router

