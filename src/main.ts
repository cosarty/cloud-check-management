import { createApp } from 'vue'
import 'normalize.css'
import '@/style/base.scss'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router, { setupRouterGuard } from '@/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import components from './components'
const createRoot = async () => {
  const app = createApp(App)
  setupRouterGuard(router)
  app.use(router)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  // app.use(components)
  await router.isReady()
  app.mount('#app')
}

createRoot()
