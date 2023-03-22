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

const getMeta = (meta: CustomMeta, prentPath?: string): any => {
  const {
    name,
    redirect,
    hideLayout,
    affix,
    auth,
    orderNo,
    title,
    hideMenu,
    ignoreKeepAlive,
    ignoreStorage,
    icon,
    coverRouter,
    isExactActive,
  } = meta as CustomMeta

  return {
    redirect: redirect ? { name: redirect } : undefined,
    meta: {
      hideLayout,
      affix: affix ?? true,
      auth,
      orderNo,
      title,
      hideMenu,
      ignoreKeepAlive: ignoreKeepAlive ?? false,
      ignoreStorage: ignoreStorage ?? false,
      icon: icon ?? 'icon-gailan',
      prent: prentPath ?? undefined,
      coverRouter: coverRouter ?? false,
      isExactActive: isExactActive ?? true,
    },
  }
}

// 动态加载
const getDynamicRouter = () => {
  const dynamicRouter: RouteRecordRaw[] = []
  const keys = Object.keys(viewComponent)
  for (const key of keys) {
    if (key.includes('index')) {
      const cm = (viewComponent[key] as any).default
      const n = cm.name ?? key.match(matchName)![0]
      const children = keys.filter(k => k.includes(`${n}/children`))
      const path = '/' + n
      dynamicRouter.push({
        name: n,
        path,
        component: async () => await cm,
        children: children.length ? getChildrenRoutes(children, n) : [],
        ...getMeta(cm),
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

    const n = cm.name ?? chid.match(matchChildName)![0]
    router.push({
      name: n,
      path: n,
      component: async () => await cm,
      children: [],
      ...getMeta(cm, prentPath),
    })
  }
  return router
}

export { viewComponent, getDynamicRouter }
