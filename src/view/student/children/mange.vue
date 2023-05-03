<template>
  <div style="background-color: white; height: 100%" class="p-11">
    <Table :action="user.auth.includes('super') ? [...AdminStudenAction, ...showStudentAction] : AdminStudenAction
      " ref="showStudneTableRef" :colums="studentColums" :request="getStudent" :page-size="7">
      <template #header>
        <CheckStudent title="添加学生" @reset="() => showStudneTableRef.reset()" #default="{ updateVisBale }"
          ref="checkStudentRef">
          <ElButton class="mb-6" type="primary" @click="updateVisBale">添加学生</ElButton>
        </CheckStudent>
      </template>
      <template #class="{ row }">
        {{ row?.class?.className ?? '未加入班级' }}
      </template>
      <template #department="{ row }">
        {{ row?.class?.department?.departmentName ?? '暂无' }}
      </template>
    </Table>
  </div>
  <ShowStudentPopup ref="showStudent"></ShowStudentPopup>
</template>
<script lang="ts">
export default defineComponent({
  title: '学生管理',
  // icon: 'icon-xuesheng',
  name: 'mange',
  auth: ['super', 'admin'],
})
</script>
<script setup lang="ts">
import { TableActionType, TableColumType } from '@/components/Table.vue'
import { bindUser, deleteUser, getStuudent, getUsersClass } from '@/http/api'
import userStore from '@/store/userStore'
import CheckStudent from './components/CheckStudent.vue'
import ShowStudentPopup from './components/ShowStudentPopup.vue'
const user = userStore()
const showStudent = ref<InstanceType<typeof ShowStudentPopup>>()
/**
 * 学生列表展示
 * 学生编辑
 * 学生添加
 * 学生删除
 *
 */

const showStudneTableRef = ref<any>()
const checkStudentRef = ref<any>()
const studentColums: TableColumType = [
  { prop: 'pic', label: '照片', type: 'image' },
  { prop: 'account', label: '学号', isSearch: true },
  { prop: 'userName', label: '姓名', isSearch: true },
  { prop: 'email', label: '邮箱' },
  {
    prop: 'sex',
    label: '性别',
    type: 'tag',
    options: {
      0: {
        txt: '女',
        type: 'warning',
      },
      1: {
        txt: '男',
        type: 'success',
      },
    },
  },
  { prop: 'class', label: '班级' },
  { prop: 'department', label: '系别' },
  {
    prop: 'isBan',
    label: '封号',
    type: 'switch',
    async event(nv: boolean, row: any) {
      await bindUser(row.userId, nv)
      row.isBan = nv
    },
  },
]

const AdminStudenAction: TableActionType = [
  {
    type: 'primary',
    title: '查看',
    link: true,
    event(row) {
      console.log('row: ', row);
      showStudent.value?.show(row.userId, row.classId)
    },
  },
]

const showStudentAction: TableActionType = [
  {
    type: 'primary',
    title: '编辑',
    link: true,
    event(row) {
      checkStudentRef.value.updateData(row, '编辑学生')
    },
  },
  {
    type: 'danger',
    title: '删除',
    confirmTitle: '确认删除',
    link: true,
    async event(row: any) {
      await deleteUser(row.userId)
      // bindUser
      showStudneTableRef.value.reset()
    },
  },
]

const getStudent = async (pram: any) => {
  const {
    data: { count, rows },
  } = await getStuudent({ ...pram, flag: 'all' })
  return [rows ?? [], count ?? 0]
}
</script>

<style scoped></style>
