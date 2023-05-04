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

export const checkClassCourse = async (id: string) =>
  await http.request({
    url: `/classSchedule/checkClassCourse/${id}`,
    method: 'get',
  })
export const endCourse = async (id: string) =>
  await http.request({
    url: `/classSchedule/endCourse/${id}`,
    method: 'get',
  })

// 获取自己授课的课程
export const getClassChedule = async () =>
  await http.request({
    url: `/classSchedule/getClassChedule/`,
    method: 'get',
  })
export const checkCourse = async (id: string) =>
  await http.request({
    url: `/classSchedule/checkCourse/${id}`,
    method: 'get',
  })
export const getSchduleStudent = async (id: string) =>
  await http.request({
    url: `/classSchedule/getSchduleStudents/${id}`,
    method: 'get',
  })
