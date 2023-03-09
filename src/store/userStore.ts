import routerStore from '@/store/routerStore'
import { UserType } from '@server/api'
import { getCurrentUser, login as loginApi } from '@/http/api/user'
import storage from '@/utils/storage'
import { CacheEnum } from '@/enum/CacheEnum'
import router from '@/router'
import { ElMessage } from 'element-plus'
import menuStore from './menuStore'

const userStore = defineStore('user', () => {
  const menu = menuStore()
  const userInfo = ref<UserType>()
  const token = ref<string>(storage.get(CacheEnum.TOKEN_NAME))
  const $router = routerStore()
  const login = async (payload: any) => {
    const { data } = await loginApi(payload)
    // 设置token
    token.value = data.token
    storage.set(CacheEnum.TOKEN_NAME, data.token)
    menu.clearAll()
    await loginAfterCallcack()
  }

  const loginAfterCallcack = async () => {
    if (!token.value) return
    // 获取用户
    await getUserInfo()

    // 构建动态路由
    await $router.buildRoute(userInfo.value.auth)

    await router.replace('/')
  }

  // 获取用户
  const getUserInfo = async (): Promise<UserType | null> => {
    if (!token.value) return null
    const { data } = await getCurrentUser()
    userInfo.value = data
    return data.auth
  }

  // 推出登录
  const logout = async (showMsg: boolean = true) => {
    storage.remove(CacheEnum.TOKEN_NAME)
    token.value = ''
    await router.push({ path: '/login', replace: true })
    userInfo.value = null
    await $router.resetRouter()
    menu.clearAll()
    if (showMsg)
      ElMessage({
        type: 'success',
        message: '退出登录成功',
      })
  }
  return { userInfo, token, login, logout, getUserInfo }
})

export default userStore
