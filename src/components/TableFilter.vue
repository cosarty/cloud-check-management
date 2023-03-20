<template>
  <div>
    <ElForm>
      <ElRow v-for="idx in rowLen" :key="idx" :gutter="20">
        <ElCol v-for="f in forFilterShow(idx - 1)" :key="f" :span="6">
          <ElFormItem
            :label-width="getField(idx, f).labelWidth ?? '100px'"
            :label="getField(idx, f).label"
          >
            <ElInput :placeholder="getField(idx, f).searcherPlaceHolder" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <div class="flex justify-end my-5">
      <ElButton>重置</ElButton><ElButton type="primary">查询</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableColumType } from './Table.vue'

const props = defineProps<{ filterField: TableColumType }>()

const forFilterShow = (idx: number) => {
  const { filterField } = props

  if (filterField.length <= idx * 4 + 4) return filterField.length - idx * 4
  return 4
}

const rowLen = computed(() => {
  const { filterField } = props

  if (filterField.length <= 4) return 1

  return Math.ceil(filterField.length / 4)
})

const getField = (idx: number, f: number) =>
  props.filterField[(idx - 1) * 4 + f - 1]
</script>

<style scoped></style>
