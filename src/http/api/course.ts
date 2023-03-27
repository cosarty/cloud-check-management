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

export const updateCourse = async (prama: any = {}) =>
  await http.request({
    url: '/course/update',
    method: 'post',
    data: prama,
  })

export const delteCourse = async (id: string) =>
  await http.request({
    url: `/course/delete/${id}`,
    method: 'post',
  })

export const getCourse = async (id: string) =>
  await http.request({
    url: `/course/getInfo/${id}`,
    method: 'get',
  })
