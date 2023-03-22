<template>
  <RouterView #default="{ Component }" v-show="hideDepart">
    <component :is="Component"></component>
  </RouterView>

  <ElCard class="card-box h-full flex flex-col" v-show="!hideDepart">
    <template #header>
      <h1>院系组织架构</h1>
    </template>
    <div class="flex w-full h-full gap-6">
      <div class="w-56 sider flex flex-col">
        <div class="add-department">
          <AddDeparment @reset="getData" />
        </div>
        <div
          class="department-list flex-grow overflow-y-auto"
          v-loading="depLoading"
        >
          <ElScrollbar
            ><div
              class="department-item"
              :class="{ active: activeDep === dp.departmentId }"
              v-for="dp in departmentList"
              :key="dp.departmentId"
            >
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="`#icon-zuzhijiagou`"></use>
              </svg>
              <div
                class="department-name"
                @click.self="checkDep(dp.departmentId)"
              >
                <template v-if="editDep !== dp.departmentId">
                  {{ dp.departmentName }}
                  <ElIcon
                    @click="editDepartment(dp.departmentId, dp.departmentName)"
                    ><Edit /></ElIcon
                ></template>

                <ElInput
                  v-else
                  ref="depName"
                  v-model="selectInpt"
                  @keydown.enter="
                    updateDepName($event, dp.departmentName, dp.departmentId)
                  "
                  @blur=";(editDep = undefined), (selectInpt = '')"
                ></ElInput>
              </div>
              <ElPopconfirm
                title="确认删除"
                @confirm="delDepartment(dp.departmentId)"
                confirm-button-text="确认"
                cancel-button-text="取消"
              >
                <template #reference>
                  <ElButton
                    type="danger"
                    :icon="Delete"
                    circle
                    :size="'small'"
                  />
                </template>
              </ElPopconfirm></div
          ></ElScrollbar>
        </div>
      </div>
      <div class="h-full overflow-y-auto flex-grow content flex flex-col">
        <div
          class="font-bold flex mb-4 items-center bg-slate-400 py-4 pl-3"
          v-if="activeDep"
        >
          系主任 :
          <ElSelect
            v-model="targetTeacher"
            class="w-32 ml-3"
            placeholder="选择系主任"
            clearable
          >
            <ElOption
              :value="op.userId"
              v-for="op in teacherList"
              :key="op.userId"
              :label="op.userName"
            />
          </ElSelect>
        </div>
        <ElScrollbar>
          <div>
            <Table
              :colums="classTabColum"
              :action="defaultAtion"
              :request="request"
              ref="tableRef"
            >
              <template #teacher="{ row }">{{
                row?.teacher?.userName ?? '未知'
              }}</template>

              <template #department="{ row }">{{
                row?.department?.departmentName ?? '未知'
              }}</template>

              <template #header
                ><div class="my-5">
                  <AddClass
                    :departList="departmentList"
                    :departmentId="activeDep"
                    @reset="() => tableRef.reset()"
                    v-slot="{ updateVisBale }"
                    ref="addclassRef"
                    ><el-button
                      type="primary"
                      :icon="Plus"
                      @click="updateVisBale"
                    >
                      添加班级
                    </el-button></AddClass
                  >
                </div></template
              >
            </Table>
          </div>
        </ElScrollbar>
      </div>
    </div>
  </ElCard>
</template>
<script lang="ts">
export default defineComponent({
  title: '院系',
  icon: 'icon-bumen-department',
  name: 'department',
  auth: 'super',
})
</script>
<script setup lang="ts">
import {
  deleteDepartment,
  getDepartment,
  updateDepartment,
  getTeacher,
  getClassList,
  delClass,
} from '@/http/api'
import AddDeparment from './components/AddDeparment.vue'
import AddClass from './components/AddClass.vue'
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import { TableColumType, TableActionType } from '@/components/Table.vue'

const router = useRouter()
const route = useRoute()

const departmentList = ref<
  {
    departmentName: string
    departmentId: string
    user: { userName: string; userId: string }
  }[]
>([])

const classTabColum: TableColumType = [
  {
    prop: 'picture',
    label: '照片',
    type: 'image',
  },
  {
    prop: 'className',
    label: '班级名字',
    isSearch: true,
    searcherPlaceHolder: '请输入班级',
  },
  {
    prop: 'teacher',
    label: '辅导员',
    isSearch: true,
    searcherPlaceHolder: '请输入辅导员',
  },
  {
    prop: 'remarks',
    label: '备注',
  },
  {
    prop: 'department',
    label: '系',
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    type: 'date',
    sort: true,
  },
]

const defaultAtion: TableActionType = [
  {
    type: 'primary',
    title: '查看',
    link: true,
    async event(row: any) {
      router.push({
        name: 'addUserToClass',
        query: { classId: row.classId },
      })
    },
  },
  {
    type: 'primary',
    title: '编辑',
    async event({
      classId,
      remarks,
      picture,
      teacherId,
      code,
      className,
      departmentId,
    }: any) {
      addclassRef.value.updateData({
        classId,
        remarks,
        picture,
        teacherId,
        code,
        className,
        departmentId,
      })
    },
  },
  {
    type: 'danger',
    title: '删除',
    confirmTitle: '确认删除',
    link: true,
    async event(row: any) {
      await delClass(row.classId)
      tableRef.value.reset()
    },
  },
]

const hideDepart = ref(false)

const addclassRef = ref<any>()
const targetTeacher = ref<string>()
const activeDep = ref<string>()
const editDep = ref<string>()
const depLoading = ref(false)
const depName = ref()
const selectInpt = ref('')
const teacherList = ref<any>([])
const tableRef = ref<any>()
onMounted(() => {
  getData()
  getTeacher().then(({ data }) => {
    teacherList.value = data
  })
})

const getData = async () => {
  depLoading.value = true
  const { data } = await getDepartment()
  departmentList.value = data
  depLoading.value = false
}

const delDepartment = async (id: string) => {
  if (id === activeDep.value) activeDep.value = undefined
  await deleteDepartment(id)
  await getData()
}

const editDepartment = async (id: string, name: string) => {
  editDep.value = id
  await nextTick()
  selectInpt.value = name
  depName.value[0].focus()
}

const updateDepName = async (e: any, departmentName: string, id: string) => {
  editDep.value = undefined
  if (departmentName === e.target.value) return
  await updateDepartment({ id, departmentName: selectInpt.value })

  await getData()
  tableRef.value.reset()
}

watch(targetTeacher, async n => {
  if (!activeDep.value) return
  const find = departmentList.value.find(
    d => d.departmentId === activeDep.value,
  )
  if (find?.user?.userId !== n) {
    await updateDepartment({ id: activeDep.value, userId: n || null })
    await getData()
  }
})

const checkDep = (id: string) => {
  activeDep.value = activeDep.value === id ? undefined : id

  const find = departmentList.value.find(
    d => d.departmentId === activeDep.value,
  )

  targetTeacher.value = find?.user?.userId ?? undefined

  tableRef.value.reset()
}

// 表格的请求方法
const request = async (pram: any) => {
  const {
    data: { count, rows },
  } = await getClassList({ ...pram, departmentId: activeDep.value })
  return [rows ?? [], count ?? 0]
}

watch(
  route,
  nr => {
    if (nr.name === 'addUserToClass') hideDepart.value = true
    else hideDepart.value = false
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.card-box {
  :deep(.el-card__body) {
    flex: 1;
    flex-shrink: 0;
    overflow-y: auto;
    padding: 0;
  }
  .sider {
    border-right: 1px solid var(--el-card-border-color);

    .add-department {
      padding: 1.1rem;
      border-bottom: 1px solid var(--el-card-border-color);
    }
    .department-list {
      padding: 0.6rem;
      .department-item {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 0.3rem;

        &:not(:first-child) {
          margin-top: 0.3rem;
        }

        // &:hover,
        &.active {
          background-color: var(--el-color-primary-light-5);
        }
        @include useIcon(1.4rem);
        .department-name {
          flex: 1;
          font-size: 13px;
        }
      }
    }
  }
  .content {
    padding: 0.7rem;
  }
}
</style>
