import 'vue-router'

declare interface CustomMeta {
  hideLayout?: boolean
  // 是否固定标签
  affix?: boolean
  // 菜单排序
  orderNo?: number
  auth?: string[] | string
  redirect?: string
  name?: string
  title?: string
  hideMenu?: boolean
  ignoreKeepAlive?: boolean
  ignoreStorage?: boolean
  icon?: string
}

export declare module 'vue' {
  interface ComponentCustomOptions extends CustomMeta {}
}

declare module 'vue-router' {
  interface RouteMeta extends CustomMeta {}
}
