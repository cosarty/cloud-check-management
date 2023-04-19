import http from '../http'
export const createStat = async (prama: any = {}) =>
  await http.request({
    url: '/statinfo/create',
    method: 'post',
    data: prama,
  })
// 统计课程的数据
export const statList = async (prama: any = {}) =>
  await http.request({
    url: '/statinfo/stat',
    method: 'post',
    data: prama,
  })
