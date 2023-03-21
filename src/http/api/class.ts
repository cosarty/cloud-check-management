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

export const delClass = async (id: any) =>
  await await http.request({
    url: `class/delete/${id}`,
    method: 'delete',
  })

export const updateClass = async (prama: any) =>
  await await http.request({
    url: `class/update`,
    method: 'post',
    data: prama,
  })
