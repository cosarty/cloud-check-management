import http from '../http'

export const getAdminHome = async () =>
  await http.request({
    url: '/home/admin',
    method: 'get',
  })
export const getTeacherHome = async () =>
  await http.request({
    url: '/home/teacher',
    method: 'get',
  })
