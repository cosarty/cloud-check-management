import http from '../http'
export const createCourse = async (prama: any = {}) =>
  await http.request({
    url: '/course/create',
    method: 'post',
    data: prama,
  })

export const getCourseList = async (prama: any = {}) =>
  await http.request({
    url: '/course/get',
    method: 'get',
    data: prama,
  })
