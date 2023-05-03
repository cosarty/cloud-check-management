<template>
  <ElDialog v-model="dialogVisible" destroy-on-close @closed=" close">
    <ClassStatInfo :user-id="userId" :class-id="classId"></ClassStatInfo>
  </ElDialog>
</template>

<script setup lang="ts">
import ClassStatInfo from '@/components/ClassStatInfo.vue'
const dialogVisible = ref(false)
const userId = ref()
const classId = ref()
const close = () => {
  userId.value = undefined
  classId.value = undefined
 
}

defineExpose({
  show: (id: string, cid: string) => {
    userId.value = id
    classId.value = cid
    dialogVisible.value = true
  }
})
</script>

<style scoped></style>