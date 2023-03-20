import http from '../http'
export const getClassList = async (prama: any) =>
  await await http.request({
    url: '/class/getList',
    method: 'get',
    data: prama,
  })
