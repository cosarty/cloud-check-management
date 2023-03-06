import { Component, ComponentPublicInstance } from 'vue'
import { RouteRecordRaw } from 'vue-router'

const viewComponent = import.meta.glob(['@/view/**/*.vue', '!@/view/**/sys'], {
  eager: true,
})

const ssRouter: RouteRecordRaw[] = []

for (const key of Object.keys(viewComponent)) {
  const cm = (viewComponent[key] as any).default
  console.log('cm: ', cm.auth)

  ssRouter.push({
    name: 'admin',
    path: '/admin',
    component: async () => await viewComponent[key],
  })
}

export { viewComponent, ssRouter }
