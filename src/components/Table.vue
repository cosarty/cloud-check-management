<template>
  <div class=" w-min mx-auto max-w-full">
    <ElTable :data="data" style="width: 100%" stripe border >
      <ElTableColumn
        :width="width ?? '150px'"
        :prop="prop"
        :label="label"
        v-for="({ label, prop, width, fixed }, idx) in colums"
        :key="idx"
        v-slot="{ row }"
        :fixed="fixed"
      >
        {{ row[prop] }}
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script setup lang="ts">
export type TableColumType = {
  prop: string
  label: string
  isSearch?: boolean
  type?: 'date' | 'default' | 'image' | 'select'
  sort?: boolean | 'desc' | 'esc'
  align?: 'left' | 'center' | 'right'
  width?: number
  options?: any
  fixed?: boolean | 'left' | 'right'
  event?: () => void
}[]
export type TableActionType = {
  title: string
  command: string
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
}[]

defineProps<{ colums: TableColumType; action?: TableActionType; data: any }>()
</script>

<style lang="scss" scoped></style>
