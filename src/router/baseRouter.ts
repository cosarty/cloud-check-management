import { RouteRecordRaw } from 'vue-router'

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []

// 这个是基础路由
/**
 * 登录
 * 忘记密码
 * 注册
 */
const baseRouter: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
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
    name: 'forbidden',
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

const getRouteNames = (array: any[]) =>
  array.forEach(item => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
getRouteNames([...baseRouter, ...forbiddenRouter])

export { baseRouter, forbiddenRouter, WHITE_NAME_LIST }

