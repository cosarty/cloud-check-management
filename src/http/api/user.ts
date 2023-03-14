import { UserType } from '@server/api'
import http from '../http'

declare type LoginPayload = {
  email: string
  password: string
}
declare type LoginData = {
  token: string
}

// 获取用户
export const login = async (payload: LoginPayload) =>
  await http.request<LoginData>({
    url: '/genIn/login',
    method: 'post',
    data: payload,
  })

export const getCurrentUser = async () =>
  await http.request<UserType>({ url: '/user/getCurrent', method: 'get' })

/**@description 更新用户 */
export const updateUser = async (payload: { sex: 0 | 1 }) =>
  await http.request<UserType>({
    url: '/user/update',
    method: 'post',
    data: payload,
  })
