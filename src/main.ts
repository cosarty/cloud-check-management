import { createApp } from 'vue'
import 'normalize.css'
import '@/style/base.scss'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const createRoot = async () => {
  const app = createApp(App)
  app.use(router)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  await router.isReady()
  app.mount('#app')
}

createRoot()
