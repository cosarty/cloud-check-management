import http from '../http'
export const getClassList = async (prama: any = {}) =>
  await http.request({
    url: '/class/getList',
    method: 'get',
    data: prama,
  })

export const createClass = async (prama: any) =>
  await http.request({
    url: '/class/create',
    method: 'post',
    data: prama,
  })

export const delClass = async (id: any) =>
  await http.request({
    url: `class/delete/${id}`,
    method: 'delete',
  })

export const updateClass = async (prama: any) =>
  await http.request({
    url: `class/update`,
    method: 'post',
    data: prama,
  })

// /class/get/{classId}

export const getClassInfo = async (classId: any) =>
  await http.request({
    url: `class/get/${classId}`,
    method: 'get',
  })

// 添加学生到班级

export const addUsertoClass = async (parm: any) =>
  await http.request({
    url: `/class/addUser`,
    method: 'post',
    data: parm,
  })

// /getUsers/{classId}

export const getUsersClass = async (classId: any, pram: any) =>
  await http.request({
    url: `class/getUsers/${classId}`,
    method: 'get',
    data: pram,
  })

// 删除学生
export const delUsersClass = async (pram: any) =>
  await http.request({
    url: `class/delUsers`,
    method: 'delete',
    data: pram,
  })
export const getClassStat = async (classId: any, pram: any) =>
  await http.request({
    url: `class/getClassStat/${classId}`,
    method: 'get',
    data: pram,
  })
export const getInstructor = async () =>
  await http.request({
    url: `class/getInstructor`,
    method: 'get',
  })
export const getTeacherCourse = async (param: any) =>
  await http.request({
    url: `class/getTeacherCourse`,
    method: 'get',
    data: param,
  })
