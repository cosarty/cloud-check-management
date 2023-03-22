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

// /class/get/{classId}

export const getClassInfo = async (classId: any) =>
  await await http.request({
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

export const getUsersClass = async (classId: any) =>
  await http.request({
    url: `class/getUsers/${classId}`,
    method: 'get',
  })
