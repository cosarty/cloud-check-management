import menuStore from '@/store/menuStore'
import { useRouter } from 'vue-router'
const closeCurrentTab = () => {
  const route = useRoute()
  const router = useRouter()
  const menu = menuStore()

  return () => menu.colseCurrent(route, router.replace)
}

export default closeCurrentTab
