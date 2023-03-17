<template>
  <ElCard class="card-box h-full flex flex-col">
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
        <div class="font-bold" v-if="activeDep">
          系主任 :
          <ElSelect
            v-model="targetTeacher"
            class="w-32"
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
          <div>fds</div>
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
} from '@/http/api'
import AddDeparment from './components/AddDeparment.vue'
import { Edit, Delete } from '@element-plus/icons-vue'
const departmentList = ref<
  {
    departmentName: string
    departmentId: string
    user: { userName: string; userId: string }
  }[]
>([])

const targetTeacher = ref<string>()
const activeDep = ref<string>()
const editDep = ref<string>()
const depLoading = ref(false)
const depName = ref()
const selectInpt = ref('')
const teacherList = ref<any>([])
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
}
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

