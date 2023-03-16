<template>
  <ElCard class="card-box h-full flex flex-col">
    <template #header>
      <h1>院系组织架构</h1>
    </template>
    <div class="flex w-full h-full gap-6">
      <div class="w-40 sider flex flex-col">
        <div class="add-department">
          <ElButton :icon="Plus" type="primary"> 添加系别</ElButton>
        </div>
        <div class="department-list flex-grow overflow-y-auto">
        <div class="department-item active">
          <svg class="icon" aria-hidden="true">
          <use :xlink:href="`#icon-zuzhijiagou`"></use>
        </svg>
        <div class="department-name">信息工程系</div>
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
import { Plus } from '@element-plus/icons-vue'
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
      .department-item{
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 0.3rem;
        &:hover,&.active{
         background-color: var(--el-color-primary-light-5)
        }
        @include useIcon(1.4rem);
        .department-name{
          flex: 1;
          font-size: 13px;
        }
      }
    }
  }
  .content {
    padding: var(--el-card-padding);
  }
}
</style>

