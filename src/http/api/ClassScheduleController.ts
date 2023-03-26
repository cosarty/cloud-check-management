import http from '../http'
export const getClassSchedule = async (prama: any = {}) =>
  await http.request({
    url: '/class/getList',
    method: 'get',
    data: prama,
  })
