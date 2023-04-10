import http from '../http'
export const createSingTask = async (prama: any = {}) =>
  await http.request({
    url: '/singTask/create',
    method: 'post',
    data: prama,
  })

// 获取签到列表
export const getSingTask = async (prama: any = {}) =>
  await http.request({
    url: '/singTask/getSingTask',
    method: 'post',
    data: prama,
  })
export const getCurrentTask = async (prama: any = {}) =>
  await http.request({
    url: '/singTask/getCurrentTask',
    method: 'post',
    data: prama,
  })
export const singEndTask = async (prama: any = {}) =>
  await http.request({
    url: '/singTask/endTask',
    method: 'post',
    data: prama,
  })
export const singDeleteTask = async (prama: any = {}) =>
  await http.request({
    url: '/singTask/deleteTask',
    method: 'post',
    data: prama,
  })
export const updateSingTask = async (prama: any = {}) =>
  await http.request({
    url: '/singTask/updateSingTask',
    method: 'post',
    data: prama,
  })
