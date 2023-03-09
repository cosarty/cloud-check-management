import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

export const getRouteTitle = (r: RouteRecordRaw | RouteLocationNormalized) => {
  const { meta: { title } = {}, name } = r
  return title || name
}
