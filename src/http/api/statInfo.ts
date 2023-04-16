import http from '../http'
export const createStat = async (prama: any = {}) =>
  await http.request({
    url: '/statinfo/create',
    method: 'post',
    data: prama,
  })
