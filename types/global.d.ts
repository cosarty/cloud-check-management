import 'vue-router'

export declare module 'vue' {
  interface ComponentCustomOptions extends CustomMeta {}
}

declare module 'vue-router' {
  interface RouteMeta extends CustomMeta {}
}
