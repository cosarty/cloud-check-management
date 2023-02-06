import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from '@/router'

const createRoot = async () => {
  const app = createApp(App)
  app.use(router)

  await router.isReady()
  app.mount('#app')
}

createRoot()
