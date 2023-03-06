import { RouteRecordRaw } from 'vue-router'

// 这个是基础路由
/**
 * 登录
 * 忘记密码
 * 注册
 */
const baseRouter: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/baseView/userPermission/login/index.vue'),
    meta: {
      hideLayout: true,
    },
  },
]

// 禁止路由
const forbiddenRouter: RouteRecordRaw[] = [
  {
    path: '/forbidden',
    redirect: { name: '404' },
    children: [
      {
        path: '404',
        name: '404',
        component: () => import('@/baseView/forbidden/404.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/forbidden',
  },
]

export { baseRouter, forbiddenRouter }
