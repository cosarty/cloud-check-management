<template>
  <ElHeader class="content-header">
    <div class="history-content">
      <div class="history-link">班级 <ElIcon :size="16" style="margin-left: 0.4rem;">
          <CircleClose />
        </ElIcon>
      </div>
      <div class="history-link">班级2 <ElIcon :size="16" style="margin-left: 0.4rem;">
          <CircleClose />
        </ElIcon>
      </div>
      <div class="history-link">班级3 <ElIcon :size="16" style="margin-left: 0.4rem;">
          <CircleClose />
        </ElIcon>
      </div>
    </div>
  </ElHeader>
</template>

<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">@import 'index';</style>