import http from '../http'
export const getAreaList = async (prama: any = {}) =>
  await http.request({
    url: '/area/getList',
    method: 'get',
    data: prama,
  })

export const createArea = async (prama: any = {}) =>
  await http.request({
    url: '/area/create',
    method: 'post',
    data: prama,
  })

export const updateArea = async (prama: any = {}) =>
  await http.request({
    url: '/area/update',
    method: 'post',
    data: prama,
  })

export const delArea = async (id: string) =>
  await http.request({
    url: `/area/delete/${id}`,
    method: 'delete',
  })
