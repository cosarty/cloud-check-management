import { CacheEnum } from '@/enum/CacheEnum'
import storage from '@/utils/storage'
import {
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteRecordNormalized,
  RouteRecordRaw,
} from 'vue-router'

const history = storage.get(CacheEnum.HISTORY_MENU)

const menuStore = defineStore('menu', () => {
  const menuRoute = ref<RouteRecordRaw[]>()
  const tabList = ref<RouteLocationNormalized[]>(
    history ? JSON.parse(history) : [],
  )
  // 需要缓存的列表
  const cacheTabList = ref<Array<string>>(
    history ? JSON.parse(history).map(r => r.name) : [],
  )
  const stortRoute = (route: RouteRecordRaw[]) => {
    // 先排序子项，再排序父项
    for (const r of route) {
      if (r?.children!.length > 0) {
        stortRoute(r?.children!)
      }
    }
    return route.sort((a, b) => {
      return (a.meta?.orderNo ?? 10) - (b.meta?.orderNo ?? 10)
    })
  }

  // 过滤隐藏路由
  const filterHidnRouter = (route: RouteRecordRaw[]): RouteRecordRaw[] =>
    route.filter(
      r => (
        r.children!.length > 0 && (r.children = filterHidnRouter(r.children!)),
        !r.meta?.hideMenu
      ),
    )
  // 构建路由
  const generateRoute = async (route: RouteRecordRaw[]) => {
    stortRoute(route)
    route = filterHidnRouter([...route])
    menuRoute.value = [...route]
  }

  const clearMenu = () => {
    menuRoute.value = undefined
  }
  const getRawRoute = (
    route: RouteLocationNormalized,
  ): RouteLocationNormalized => {
    if (!route) return route
    const { matched, ...opt } = route
    return {
      ...opt,
      // 如果matched存在有效值，则过滤matched属性中的多余的属性
      matched: (matched
        ? matched.map(item => ({
            meta: item.meta,
            name: item.name,
            path: item.path,
          }))
        : undefined) as RouteRecordNormalized[],
    }
  }

  //添加标签页
  /**
   *  - 1. 特殊页面跳过 和 禁止页面跳过
   *  - 2. 打开已存在的标签页则更新标签页，否则添加
   *  - 3. 缓存标签页
   */
  const addTab = (r: RouteLocationNormalized) => {
    const { fullPath, meta, name, query } = getRawRoute(r)
    if (['forbidden', 'login'].some(n => r.fullPath.includes(n))) return
    if (!r.meta.affix) return

    // 查看标签页是否存在
    let updateIndex = -1

    // 标签页已经存在，不在重复添加标签
    const tabHasExits = tabList.value.some((tab, index) => {
      updateIndex = index
      return (
        tab.name === name ||
        (meta.coverRouter &&
          // 子集覆盖父集
          ((meta.prent &&
            (tab.name === meta.prent || tab.meta.prent === meta.prent)) ||
            // 父集覆盖 子集
            tab.fullPath.includes(name as string)))
      )
    })

    // 标签已经存在就更新
    // 标签已经存在，执行更新操作
    if (tabHasExits) {
      // const curTab = toRaw(tabList.value)[updateIndex] // 获取当前标签页路由记录
      // if (!curTab) {
      //   return
      // }
      tabList.value.splice(updateIndex, 1, getRawRoute(r)) // 替换原有的标签页路由记录
    } else {
      tabList.value.push(getRawRoute(r))
    }

    updateCacheTab()
  }

  const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key: any, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return
        }
        seen.add(value)
      }
      return value
    }
  }

  // 更新缓存
  const updateCacheTab = () => {
    Promise.resolve().then(() => {
      const cacheKeep = toRaw(tabList.value)
        .filter(tab => !tab.meta.ignoreKeepAlive)
        .map(tab => (tab.meta.prent || tab.name) as string)
        .filter(Boolean)

      // 过滤keepAlive
      cacheTabList.value = [...new Set(cacheKeep)]
      const list = [
        ...toRaw(tabList.value)
          .filter(tab => !tab.meta.ignoreStorage)
          .map(({ fullPath, name, params, query, path, meta }) => ({
            fullPath,
            name,
            params,
            query,
            path,
            meta,
          })),
      ]

      // 过滤storage
      storage.set(CacheEnum.HISTORY_MENU, JSON.stringify(list))
    })
  }

  // 关闭方法
  const colseHandle = (path: string) => {
    const index = tabList.value.findIndex(item => item.name === path)
    if (index !== -1) {
      tabList.value.splice(index, 1)
    }
    updateCacheTab()
    return
  }

  // 关闭标签
  const closeTag = (
    r: RouteLocationNormalized,
    route: RouteLocationNormalized,
    replace: (to: RouteLocationRaw) => void,
  ) => {
    const isCurrent = r.name === route.name

    if (!isCurrent) {
      colseHandle(r.name as string)
      return
    }

    colseCurrent(route, replace)
  }
  // 清空标签
  const clearAll = () => {
    tabList.value = []
    storage.remove(CacheEnum.HISTORY_MENU)
    cacheTabList.value = []
  }

  const colseCurrent = (
    route: RouteLocationNormalized,
    replace: (to: RouteLocationRaw) => void,
  ) => {
    const full = route.name as string
    const index = tabList.value.findIndex(item => item.name === full)

    let target: RouteLocationRaw | string
    // 如果关闭的是最左侧的就跳到右边
    if (index === 0) {
      if (tabList.value.length === 1) {
        target = '/home'
      } else {
        target = {
          name: tabList.value[index + 1].name!,
          query: tabList.value[index + 1].query!,
        }
      }
      colseHandle(full)
      replace(target)
    } else if (index !== -1) {
      // 非最左侧标签 关闭后跳转到左侧标签页

      target = { name: tabList.value[index - 1].name! }
      colseHandle(full)
      replace(target)
    }
  }

  return {
    menuRoute,
    generateRoute,
    clearMenu,
    addTab,
    tabList,
    clearAll,
    closeTag,
    colseCurrent,
    cacheTabList,
  }
})

export default menuStore
