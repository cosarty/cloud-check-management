import http from '../http'

export const addHourse = async (prama: any) =>
  await http.request({
    url: '/classHourse/create',
    method: 'post',
    data: prama,
  })

export const delHourse = async (id: any) =>
  await http.request({
    url: `/classHourse/del/${id}`,
    method: 'delete',
  })

export const updateHourse = async (prama: any) =>
  await http.request({
    url: '/classHourse/update',
    method: 'post',
    data: prama,
  })
