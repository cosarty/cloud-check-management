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

export const sendMail = async (payload: { email: string; type: 'register' }) =>
  await http.request({
    url: '/genIn/sendMail',
    method: 'post',
    data: payload,
  })

// 更新邮箱
export const updateEmail = async (payload: {
  email?: string
  captcha?: string
}) =>
  await http.request({
    url: '/user/updateEmail',
    method: 'post',
    data: payload,
  })

export const updatePassword = async (payload: {
  newPassword?: string
  oldPassword?: string
  email: string
  capacha: string
}) =>
  await http.request({
    url: '/user/updatePassword',
    method: 'post',
    data: payload,
  })
