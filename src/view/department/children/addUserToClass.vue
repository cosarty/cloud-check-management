<template>
  <div style="background-color: white; height: 100%">
    <div class="h-14 w-full bg-slate-300 flex items-center justify-between box-border px-5">
      <div class="flex items-center">
        <el-avatar :size="40" class="mr-3" :src="classInfo?.picture ??
          'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
          " />
        <span class="text-2xl font-700 mr-3 align-middle">
          {{ classInfo?.className }}
        </span>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
          {{ classInfo?.teacher?.userName ?? '暂无辅导员' }}
        </span>
      </div>
      <div>
        <el-button link type="primary" @click="classVisible = true">查看</el-button>
        <el-button :icon="Plus" type="primary" @click="studentVisible = true">添加学生</el-button>
        <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="确认删除" @confirm="deleteUser"><template
            #reference>
            <el-button type="danger" class="ml-2">删除学生</el-button></template></el-popconfirm>
      </div>
    </div>

    <div class="my-5">
      <Table isSelect :action="showStudentAction" ref="showStudneTableRef" :colums="studentColums" :request="getStudent"
        :page-size="10"></Table>
    </div>
    <el-dialog v-model="studentVisible" title="添加学生" width="58%" destroy-on-close>
      <Table ref="studenTableRef" isSelect :colums="studentColums" :request="request" :page-size="4"></Table>
      <template #footer>
        <el-button @click="studentVisible = false">取消</el-button>
        <el-button type="primary" @click="addConfim"> 确认 </el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="classVisible" title="查看班级" width="78%" destroy-on-close style="width: 90%;"
      @closed="activeName = 'first'">

      <el-tabs v-model="activeName" style="height: 60%;">
        <el-tab-pane label="统计" name="first">

          <ClassStatInfo :class-id="classId"></ClassStatInfo>

        </el-tab-pane>
        <el-tab-pane label="课表" name="second">

          <Tmetable :class-id="classId"></Tmetable>

        </el-tab-pane>

      </el-tabs>

    </el-dialog>
  </div>
  <ShowStudentPopup ref="showStudent"></ShowStudentPopup>
</template>
<script lang="ts">
export default defineComponent({
  title: '班级信息',
  // icon: 'icon-xuesheng',ff
  name: 'addUserToClass',
  auth: ['super', 'department'],
  hideMenu: true,
})
</script>
<script setup lang="ts">
import { TableActionType, TableColumType } from '@/components/Table.vue'
import closeCurrentTab from '@/hooks/closeCurrentTab'
import ClassStatInfo from '@/components/ClassStatInfo.vue'
import Tmetable from '@/components/Tmetable.vue'
import {
  addUsertoClass,
  delUsersClass,
  getClassInfo,
  getStuudent,
  getUsersClass,
} from '@/http/api'
import { Plus } from '@element-plus/icons-vue'
import ShowStudentPopup from '../../student/children/components/ShowStudentPopup.vue'
const route = useRoute()
const close = closeCurrentTab()
const classId = ref<string>('')
const studentVisible = ref(false)
const classVisible = ref(false)
const classInfo = ref<any>({})
const studenTableRef = ref<any>()
const showStudneTableRef = ref<any>()
const showStudent = ref<InstanceType<typeof ShowStudentPopup>>()
const activeName = ref('first')
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
]

const showStudentAction: TableActionType = [
  {
    type: 'primary', title: '查看', link: true, event(row) {
      console.log('row: ', row);
      showStudent.value?.show(row.userId, classId.value)
    },
  },
  {
    type: 'danger',
    title: '删除',
    confirmTitle: '确认删除',
    link: true,
    async event(row: any) {
      await delUsersClass({ classId: classId.value, userId: row.userId })
      showStudneTableRef.value.reset()
    },
  },
]

const request = async (pram: any) => {
  const {
    data: { count, rows },
  } = await getStuudent(pram)
  return [rows ?? [], count ?? 0]
}

const getStudent = async (pram: any) => {
  const {
    data: { count, rows },
  } = await getUsersClass(classId.value, pram)
  return [rows ?? [], count ?? 0]
}
const addConfim = async () => {
  await addUsertoClass({
    classId: classId.value,
    userId: studenTableRef.value.selectValue.map(u => u.userId),
  })
  studentVisible.value = false

  showStudneTableRef.value.reset()
}

const deleteUser = async () => {
  if (!showStudneTableRef.value.selectValue.length) {
    ElMessage.warning('请选择学生')
    return
  }
  await delUsersClass({
    classId: classId.value,
    userId: showStudneTableRef.value.selectValue.map(u => u.userId),
  })
  showStudneTableRef.value.reset()
}

watch(
  () => route,
  async nq => {
    if (nq!.name === 'addUserToClass') {
      if (!nq.query?.classId) {
        close()
        ElMessage.warning('班级id无效')
        return
      }
      if (nq.query?.classId !== classId.value)
        classId.value = nq.query.classId as string
      const { data } = await getClassInfo(classId.value)
      await nextTick()
      classInfo.value = data
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped></style>
