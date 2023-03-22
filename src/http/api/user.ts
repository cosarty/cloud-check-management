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

// 获取老师

export const getTeacher = async () =>
  await http.request({
    url: '/user/getTeacher',
    method: 'get',
  })

// 获取学生未加入班级的学生
export const getStuudent = async (pram?: any) =>
  await http.request({
    url: '/user/getstudent',
    method: 'get',
    data: pram,
  })

export const deleteUser = async (userId: string) =>
  await http.request({
    url: '/user/delete',
    method: 'post',
    data: { userId },
  })

export const bindUser = async (userId: string, isBan: boolean) =>
  await http.request({
    url: '/user/bind',
    method: 'post',
    data: { userId, isBan },
  })

// 注册学生 或者老师
export const register = async (payload: any) =>
  await http.request<LoginData>({
    url: '/genIn/register',
    method: 'post',
    data: payload,
  })
