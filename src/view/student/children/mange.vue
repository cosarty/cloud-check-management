<template>
  <div style="background-color: white; height: 100%" class="pt-11">
    <Table
      :action="
        user.auth.includes('super') ? showStudentAction : AdminStudenAction
      "
      ref="showStudneTableRef"
      :colums="studentColums"
      :request="getStudent"
      :page-size="7"
    >
      <template #header>
        <CheckStudent
          @reset="() => showStudneTableRef.reset()"
          #default="{ updateVisBale }"
        >
          <ElButton class="mb-6" type="primary" @click="updateVisBale"
            >添加学生</ElButton
          >
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
const user = userStore()
/**
 * 学生列表展示
 * 学生编辑
 * 学生添加
 * 学生删除
 *
 */

const showStudneTableRef = ref<any>()
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
  { type: 'primary', title: '查看', link: true },
]

const showStudentAction: TableActionType = [
  { type: 'primary', title: '编辑', link: true },
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
