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

export const updateDepartment = async (payload: any) =>
  await http.request({
    url: '/department/update',
    method: 'put',
    data: payload,
  })

export const deleteDepartment = async (id: any) =>
  await http.request({
    url: `/department/del/${id}`,
    method: 'delete',
  })
