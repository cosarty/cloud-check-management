import http from '../http'
export const createClassSchedule = async (prama: any = {}) =>
  await http.request({
    url: '/classSchedule/create',
    method: 'post',
    data: prama,
  })
