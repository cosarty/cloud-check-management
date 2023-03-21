import http from '../http'
export const getClassList = async (prama: any) =>
  await await http.request({
    url: '/class/getList',
    method: 'get',
    data: prama,
  })

export const createClass = async (prama: any) =>
  await await http.request({
    url: '/class/create',
    method: 'post',
    data: prama,
  })
