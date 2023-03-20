<template>
  <div>
    <ElPagination
      :hide-on-single-page="true"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      v-model:current-page="pageCount"
      @current-change="pageChange"
      @next-click="nexChange"
      @prev-click="prevChange"
    />
  </div>
</template>

<script setup lang="ts">
const pageCount = ref<number>(1)
withDefaults(defineProps<{ pageSize?: number; total: number }>(), {
  pageSize: 10,
})
const pageChange = (e: any) => {
  // console.log('e: ', e)
  pageCount.value = e
}
const prevChange = (e: any) => {
  pageCount.value = e - 1
}
const nexChange = (e: any) => {
  pageCount.value = e + 1
}

const emit = defineEmits<{ (e: 'pageChange', pageCount: number): void }>()
watch(
  pageCount,
  count => {
    emit('pageChange', count)
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss"></style>
