import http from '../http'

export const createDepartment = async (payload: any) =>
  await http.request({
    url: '/department/create',
    method: 'post',
    data: payload,
  })

export const getDepartment = async () =>
  await http.request({
    url: '/department/get',
    method: 'get',
  })
