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

  const auth = computed<any>(() => {
    const auth: string[] = []
    if (userInfo.value.isAdmin) auth.push('admin')
    if (userInfo.value.super) return ['super']
    if (['teacher', 'student'].includes(userInfo.value.auth))
      auth.push(userInfo.value.auth)
    return auth
  })

  // 其他权限
  const otherAuh = computed(() => {
    const auth: string[] = []
    if (userInfo.value.department) auth.push('department')
    if (userInfo.value.instructor.length) auth.push('instructor')
    return auth
  })

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
    await $router.buildRoute([...auth.value,...otherAuh.value])

    await router.replace('/')
  }

  // 获取用户
  const getUserInfo = async (): Promise<UserType | null> => {
    if (!token.value) return null
    const { data } = await getCurrentUser()
    userInfo.value = data
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
  return { userInfo, token, login, logout, getUserInfo, auth,otherAuh }
})

export default userStore
