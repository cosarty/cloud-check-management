import http from '../http'

export const updateTime = async (prama: any) =>
  await http.request({
    url: '/time/updateTime',
    method: 'post',
    data: prama,
  })

export const getTime = async () =>
  await http.request({
    url: '/time/getTime',
    method: 'get',
  })
