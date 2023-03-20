<template>
  <div class="w-min mx-auto max-w-full">
    <TableFilter :filterField="searcheProps" v-if="searcheProps.length" />
    <ElTable :data="data" style="width: 100%" stripe border>
      <ElTableColumn
        :width="width ?? '150px'"
        :prop="prop"
        :label="label"
        v-for="(
          { label, type, prop, width, fixed, align, options, event }, idx
        ) in colums"
        :key="idx"
        v-slot="{ row }"
        :fixed="fixed ?? false"
        :align="align ?? 'center'"
      >
        <template v-if="type === 'image'">
          <ElImage
            :src="row[prop]"
            fit="fill"
            lazy
            :hide-on-click-modal="true"
            :preview-src-list="[row[prop]!]"
            class="w-16 h-16 rounded-full"
          />
        </template>
        <template v-else-if="type === 'date'">
          {{ dayjs(row[prop]).format('YYYY-mm-DD') }}
        </template>

        <template v-else-if="type === 'select'">
          <ElSelect :model-value="row[prop]" @change="e => event?.(e, row)">
            <ElOption
              v-for="(op, k) in options"
              :value="k"
              :label="op"
              :key="k"
            ></ElOption>
          </ElSelect>
        </template>
        <template v-else="!type"> {{ row[prop] }}</template>
      </ElTableColumn>

      <!-- action -->
      <ElTableColumn
        v-if="action && action.length"
        #default="{ row }"
        align="center"
        fixed="right"
        :width="buttonWidth"
      >
        <ElButton
          v-for="({ type, title, event, link }, idx) in action"
          :size="'small'"
          :key="idx"
          :link="link"
          :type="type ?? 'default'"
          @click="() => event?.(row)"
          >{{ title }}</ElButton
        >
      </ElTableColumn>
      <ElTableColumn
        v-else-if="$slots.button"
        #default="{ row }"
        align="center"
        fixed="right"
      >
        <slot name="button" :row="row"></slot>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
/**
 * 1. 搜索自定义
 * 3. action按钮
 * 4. 默认的action按钮
 */

export type TableColumType = {
  prop: string
  label: string
  isSearch?: boolean
  type?: 'date' | 'default' | 'image' | 'select'
  sort?: boolean | 'desc' | 'esc'
  align?: 'left' | 'center' | 'right'
  width?: number
  options?: any // 只有当prop 是select的时候才有用
  fixed?: boolean | 'left' | 'right'
  event?: (e: any, row: any) => void // 只有当prop 是select的时候才有用
  labelWidth?: string
  searcherPlaceHolder?: string
}[]
export type TableActionType = {
  title: string
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  event?: (row: any) => void
  link?: boolean
}[]

const props = defineProps<{
  colums: TableColumType
  action?: TableActionType
  data: any
}>()

// 计算action的宽高
const buttonWidth = computed(() => {
  const { action } = props
  if (action && action.length) {
    return (
      [...action].reduce((width: number, btn: any) => {
        return (width += (btn?.title?.length ?? 0) * 15 + 25)
      }, 0) + 24
    )
  }

  return 0
})

// 过来搜索
const searcheProps = computed(() => props.colums.filter(c => c.isSearch))
</script>

<style lang="scss" scoped></style>
