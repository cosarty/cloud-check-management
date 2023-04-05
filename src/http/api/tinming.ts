import http from '../http'

// 获取定时任务列表
export const getTimingList = async (prama: any = {}) =>
  await http.request({
    url: '/timing/getList',
    method: 'post',
    data: prama,
  })
export const endTaskTiming = async (prama: any = {}) =>
  await http.request({
    url: '/timing/endTask',
    method: 'post',
    data: prama,
  })

  export const delTaskTiming = async (prama: any = {}) =>
  await http.request({
    url: '/timing/deleteTask',
    method: 'post',
    data: prama,
  })