<template>
  <div>
    <div class=" mb-3">
      <SendTask>
        <ElButton type="primary">发起签到</ElButton>
      </SendTask>
    </div>
    签到任务
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ isHistory: boolean }>()
</script>

<style scoped lang="scss"></style>