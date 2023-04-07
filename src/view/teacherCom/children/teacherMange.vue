<template>
  <div style="background-color: white; height: 100%" class="p-11">
    <Table
      :action="
        user.auth.includes('super') ? showStudentAction : []
      "
      ref="showStudneTableRef"
      :colums="teacherColumsComp"
      :request="gettec"
      :page-size="7"
    >
      <template #header>
        <CheckTeacher
          title="添加教师"
          v-if="user.auth.includes('super')"
          @reset="() => showStudneTableRef.reset()"
          #default="{ updateVisBale }"
          ref="checkTeacherRef"
        >
          <ElButton class="mb-6" type="primary" @click="updateVisBale"
            >添加教师</ElButton
          >
        </CheckTeacher>
      </template>
      <template #class="{ row }">
        {{ row?.class?.className ?? '未加入班级' }}
      </template>
      <template #department="{ row }">
        {{ row?.department?.departmentName ?? '暂无' }}
      </template>
    </Table>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  title: '教师管理',
  // icon: 'icon-xuesheng',
  name: 'teacherMange',
  auth: ['super', 'admin'],
  orderNo: 1,
})
</script>
<script setup lang="ts">
import { TableActionType, TableColumType } from '@/components/Table.vue'
import { bindUser, deleteUser, getTeacher, setAdmin } from '@/http/api'
import userStore from '@/store/userStore'
import CheckTeacher from './components/CheckTeacher.vue'
const user = userStore()
/**
 * 学生列表展示
 * 学生编辑
 * 学生添加
 * 学生删除
 *
 */

const showStudneTableRef = ref<any>()
const checkTeacherRef = ref<any>()
const teacherColums: TableColumType = [
  { prop: 'pic', label: '照片', type: 'image' },
  { prop: 'account', label: '教师编号', isSearch: true },
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
  { prop: 'department', label: '系别' },
  {
    prop: 'isBan',
    label: '封号',
    type: 'switch',
    async event(nv: boolean, row: any) {
      await bindUser(row.userId, nv)
      row.isBan = nv
    },
    fixed: 'right',
  },
  {
    prop: 'isAdmin',
    label: '管理员',
    type: 'switch',
    async event(nv: boolean, row: any) {
      await setAdmin(row.userId, nv)
      row.isAdmin = nv
    },
    fixed: 'right',
  },
]

const AdminStudenAction: TableActionType = [
  { type: 'primary', title: '查看', link: true },
]

const showStudentAction: TableActionType = [
  {
    type: 'primary',
    title: '编辑',
    link: true,
    event(row) {
      checkTeacherRef.value.updateData(row, '编辑教师')
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

const teacherColumsComp = computed(() => {
  if (user.auth.includes('admin')) {
    return teacherColums.slice(0, -1)
  }
  return teacherColums
})

const gettec = async (pram: any) => {
  const {
    data: { count, rows },
  } = await getTeacher({
    ...pram,
    ...(user.auth.includes('admin') ? {} : { flag: 'all' }),
  })
  return [rows ?? [], count ?? 0]
}
</script>

<style scoped></style>
