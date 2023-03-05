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
  await http.request<LoginData>({url:'/genIn/login', method: 'post', data: payload })
