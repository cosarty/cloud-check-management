import { RouteRecordRaw } from 'vue-router'

const viewComponent = import.meta.glob(['@/view/**/*.vue', '!@/view/**/sys'], {
  eager: false,
})

const ssRouter: RouteRecordRaw[] = []

for (const key of Object.keys(viewComponent)) {
  console.log('viewComponent[key]: ', viewComponent[key])

  ssRouter.push({
    name: 'admin',
    path: '/admin',
    component: () => viewComponent[key](),
  })
}

export { viewComponent, ssRouter }
