import http from '../http'
export const createSingTask = async (prama: any = {}) =>
  await http.request({
    url: '/singTask/create',
    method: 'post',
    data: prama,
  })
