<template>
  <ElCard class="card-box h-full flex flex-col">
    <template #header>
      <h1>院系组织架构</h1>
    </template>
    <div class="flex w-full h-full gap-6">
      <div class="w-56 bg-slate-400">系别</div>
      <div class="h-full overflow-y-auto flex-grow">
        <ElScrollbar>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>

          <div>fds</div>
          <div>fds</div>

          <div>fds</div>
          <div>fds</div>

          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>
          <div>fds</div>

          <div>fds</div>
          <div>fds</div>

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
<script setup lang="ts"></script>

<style scoped lang="scss">
.card-box {
  :deep(.el-card__body) {
    flex: 1;
    flex-shrink: 0;
    overflow-y: auto;
  }
}
</style>
