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
          <div
            class="department-item"
            :class="{ active: activeDep === dp.departmentId }"
            v-for="dp in departmentList"
            :key="dp.departmentId"
            @click="
              activeDep = activeDep === dp.departmentId ? null : dp.departmentId
            "
          >
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="`#icon-zuzhijiagou`"></use>
            </svg>
            <div class="department-name">{{ dp.departmentName }}</div>
          </div>
        </div>
      </div>
      <div class="h-full overflow-y-auto flex-grow content">
        <ElScrollbar>
          <div>fds</div>
          <div>fds</div>
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
import { getDepartment } from '@/http/api'
import AddDeparment from './components/AddDeparment.vue'

const departmentList = ref<{ departmentName: string; departmentId: string }[]>(
  [],
)
const activeDep = ref()
const depLoading = ref(false)

onMounted(() => {
  getData()
})

const getData = async () => {
  depLoading.value = true
  const { data } = await getDepartment()
  departmentList.value = data
  depLoading.value = false
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

        &:hover,
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
