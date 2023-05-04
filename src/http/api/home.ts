import http from '../http'

export const getAdminHome = async () =>
  await http.request({
    url: '/home/admin',
    method: 'get',
  })
