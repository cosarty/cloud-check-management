import { UserType } from '@server/api'
import { defineStore } from 'pinia'
import { getCurrentUser, login as loginApi } from '@/http/api/user'
import storage from '@/utils/storage'
import { CacheEnum } from '@/enum/CacheEnum'
import router from '@/router'

const userStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserType>()
    const token = ref<string>('')

    const login = async (payload: any) => {
      const { data } = await loginApi(payload)
      // 设置token
      token.value = data.token
      storage.set(CacheEnum.TOKEN_NAME, data.token)
      await loginAfterCallcack()
    }

    const loginAfterCallcack = async () => {
      if (!token.value) return
      // 获取用户
      const auth = await getUserInfo()

      // 构建动态路由
      console.log('auth: ', auth)

      await router.replace('/')
    }

    // 获取用户
    const getUserInfo = async (): Promise<UserType | null> => {
      if (!token.value) return null
      const { data } = await getCurrentUser()
      userInfo.value = data
      return data.auth
    }

    const logout = () => {
      storage.remove(CacheEnum.TOKEN_NAME)
      userInfo.value = null
      token.value = ''
      router.push('/login')
    }
    return { userInfo, token, login, logout, getUserInfo }
  },
  {
    persist: {
      key: CacheEnum.TOKEN_NAME,
      storage: localStorage,
      paths: ['token'],
    },
  },
)

export default userStore
