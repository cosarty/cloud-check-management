import http from '../http'
export const createClassSchedule = async (prama: any = {}) =>
  await http.request({
    url: '/classSchedule/create',
    method: 'post',
    data: prama,
  })

export const getTeacherClass = async (prama: any = {}) =>
  await http.request({
    url: '/classSchedule/getTeacherClass',
    method: 'get',
    data: prama,
  })

export const getStudentClass = async (prama: any = {}) =>
  await http.request({
    url: '/classSchedule/getStudentClass',
    method: 'get',
    data: prama,
  })
