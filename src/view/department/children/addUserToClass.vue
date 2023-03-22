<template>
  <div style="background-color: white; height: 100%">
    <div>班级信息</div>
    <input type="text" value="fsd" />
    <button @click="close">关闭</button>
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
import closeCurrentTab from '@/hooks/closeCurrentTab'
const route = useRoute()
const close = closeCurrentTab()
const classId = ref<string>('')
watch(
  () => route,
  nq => {
    if (nq.name === 'addUserToClass') {
      if (!nq.query?.classId) {
        close()
        ElMessage.warning('班级id无效')
        return
      }

      if (nq.query?.classId !== classId.value)
        classId.value = nq.query.classId as string
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
