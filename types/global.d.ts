import 'vue-router'

export declare module 'vue' {
  interface ComponentCustomOptions {
    auth?: string[] | string
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    hideLayout?: boolean
  }
}
