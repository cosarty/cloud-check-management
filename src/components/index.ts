import { App, Component } from 'vue'

const install = (app: App) => {
  const comps = import.meta.glob('./*.vue', { eager: true })

  for (const cp of Object.keys(comps)) {
    const name = cp.match(/(?<=\/)(.*?)(?=\.vue$)/g)?.[0]
    if (name) {
      app.component(name, comps[cp] as Component)
    }
  }
}

export default { install }
