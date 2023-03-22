<template>
  <div style="background-color: white; height: 100%">
    <div
      class="h-14 w-full bg-slate-300 flex items-center justify-between box-border px-5"
    >
      <div class="flex items-center">
        <el-avatar
          :size="40"
          class="mr-3"
          :src="
            classInfo?.picture ??
            'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
          "
        />
        <span class="text-2xl font-700 mr-3 align-middle">
          {{ classInfo?.className }}
        </span>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
          {{ classInfo?.teacher?.userName ?? '暂无辅导员' }}
        </span>
      </div>
      <div>
        <el-button :icon="Plus" type="primary" @click="studentVisible = true"
          >添加学生</el-button
        >
        <el-popconfirm confirm-button-text="是" cancel-button-text="否"
          ><template #reference>
            <el-button type="danger" class="ml-2">删除学生</el-button></template
          ></el-popconfirm
        >
      </div>
    </div>

    <div>显示表格</div>
    <el-dialog
      v-model="studentVisible"
      title="添加学生"
      width="58%"
      destroy-on-close
    >
      <Table
        ref="studenTableRef"
        isSelect
        :colums="studentColums"
        :request="request"
        :page-size="4"
      ></Table>
      <template #footer>
        <el-button @click="studentVisible = false">取消</el-button>
        <el-button type="primary" @click="addConfim"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  title: '班级信息',
  // icon: 'icon-xuesheng',ff
  name: 'addUserToClass',
  auth: 'super',
  hideMenu: true,
})
</script>
<script setup lang="ts">
import { TableColumType } from '@/components/Table.vue'
import closeCurrentTab from '@/hooks/closeCurrentTab'
import {
  addUsertoClass,
  getClassInfo,
  getStuudent,
  getUsersClass,
} from '@/http/api'
import { Plus } from '@element-plus/icons-vue'
const route = useRoute()
const close = closeCurrentTab()
const classId = ref<string>('')
const studentVisible = ref(false)
const classInfo = ref<any>({})
const studenTableRef = ref<any>()

const studentColums: TableColumType = [
  { prop: 'pic', label: '照片', type: 'image' },
  { prop: 'account', label: '学号', isSearch: true },
  { prop: 'userName', label: '姓名', isSearch: true },
  { prop: 'email', label: '邮箱' },
  { prop: 'sex', label: '性别' },
]

const request = async (pram: any) => {
  const {
    data: { count, rows },
  } = await getStuudent(pram)
  return [rows ?? [], count ?? 0]
}
const addConfim = async () => {
  console.log()

  await addUsertoClass({
    classId: classId.value,
    userId: studenTableRef.value.selectValue.map(u => u.userId),
  })
  studentVisible.value = false

  const data = await getUsersClass(classId.value)
  console.log('data: ', data)
}

watch(
  () => route,
  async nq => {
    if (nq.name === 'addUserToClass') {
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
  { immediate: true },
)
</script>

<style scoped></style>
