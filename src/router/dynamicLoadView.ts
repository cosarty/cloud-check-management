import { CustomMeta } from 'types/global'
import { RouteRecordRaw } from 'vue-router'

const viewComponent = import.meta.glob(
  ['@/view/*/index.vue', '@/view/**/children/*.vue', '!@/view/**/sys'],
  {
    eager: true,
  },
)

const matchName = /(?<=view\/)[^\/]+/g
const matchChildName = /(?<=children\/)(.*?)(?=\.vue$)/g

// 动态加载
const getDynamicRouter = () => {
  const dynamicRouter: RouteRecordRaw[] = []
  const keys = Object.keys(viewComponent)
  for (const key of keys) {
    if (key.includes('index')) {
      const cm = (viewComponent[key] as any).default
      const { name, redirect, ...res } = cm as CustomMeta
      const n = name ?? key.match(matchName)![0]
      const children = keys.filter(k => k.includes(`${n}/children`))
      const path = '/' + n
      dynamicRouter.push({
        name: n,
        path,
        component: async () => await cm,
        children: children.length ? getChildrenRoutes(children, path) : [],
        redirect: { name: redirect } ?? undefined,
        meta: res,
      })
    }
  }
  return dynamicRouter
}

// 获取子路由
const getChildrenRoutes = (children: string[], prentPath: string) => {
  const router: RouteRecordRaw[] = []
  for (const chid of children) {
    const cm = (viewComponent[chid] as any).default
    const { name, redirect, ...res } = cm as CustomMeta
    const n = cm.name ?? chid.match(matchChildName)![0]
    router.push({
      name: n,
      path: n,
      component: async () => await cm,
      meta: res,
      // redirect: { name: redirect } ?? undefined,
      children: [],
    })
  }
  return router
}

export { viewComponent, getDynamicRouter }

