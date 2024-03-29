<template>
  <ElScrollbar style="padding-right: 10px">
    <div class="w-min mx-auto max-w-full">
      <TableFilter
        :filterField="searcheProps"
        v-if="searcheProps.length"
        @change="filteChangeHanle"
        @reset="reset"
      />

      <slot name="header"></slot>

      <ElTable
        :data="data"
        style="width: 100%"
        @selection-change="selectChange"
        stripe
        border
        v-loading="loading"
        @sort-change="sortHandle"
      >
        <ElTableColumn
          v-if="isSelect"
          type="selection"
          width="55"
        ></ElTableColumn>
        <ElTableColumn
          :width="width ?? '150px'"
          :prop="prop"
          :label="label"
          v-for="(
            { label, type, prop, width, fixed, align, options, event, sort,opTrans },
            idx
          ) in colums"
          :key="idx"
          v-slot="{ row }"
          :fixed="fixed ?? false"
          :align="align ?? 'center'"
          :sortable="sort ? 'custom' : false"
        >
          <template v-if="$slots[prop]"
            ><slot :name="prop" :row="row"> {{ row[prop] }}</slot></template
          >
          <template v-else-if="type === 'image'">
            <ElImage
              :src="row[prop]"
              fit="fill"
              lazy
              preview-teleported
              :hide-on-click-modal="true"
              :preview-src-list="[row[prop]!]"
              class="w-10 h-10 rounded-full"
            />
          </template>
          <template v-else-if="type === 'date'">
            {{ dayjs(row[prop]).format('YYYY-MM-DD HH:mm') }}
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

          <template v-else-if="type === 'tag'">
            <ElTag
              v-if="options[opTrans?.(row[prop]) ?? row[prop]]"
              :type="options[opTrans?.(row[prop]) ?? row[prop]]?.type ?? 'info'"
              >{{ options[opTrans?.(row[prop]) ?? row[prop]]?.txt ?? '未知' }}</ElTag
            >
          </template>
          <template v-else-if="type === 'switch'">
            <ElSwitch
              :model-value="row[prop]"
              @change="$event => event?.($event, row)"
            ></ElSwitch>
          </template>
          <template v-else>{{ row[prop] }}</template>
        </ElTableColumn>

        <!-- action -->
        <ElTableColumn
          v-if="action && action.length"
          #default="{ row }"
          align="center"
          fixed="right"
          :width="buttonWidth"
        >
          <template
            v-for="({ type, title, event, link, confirmTitle }, idx) in action"
            :key="idx"
          >
            <ElPopconfirm
              v-if="confirmTitle"
              :title="confirmTitle"
              @confirm="() => event?.(row)"
              confirm-button-text="是"
              cancel-button-text="否"
            >
              <template #reference>
                <ElButton
                  :size="'small'"
                  :link="link"
                  :type="type ?? 'default'"
                  >{{ title }}</ElButton
                >
              </template>
            </ElPopconfirm>
            <ElButton
              v-else
              :size="'small'"
              :link="link"
              :type="type ?? 'default'"
              @click="() => event?.(row)"
              >{{ title }}</ElButton
            >
          </template>
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

      <div class="flex justify-end mt-5" v-if="total > pageSize">
        <Pagination
          :total="total"
          :page-size="pageSize"
          @pageChange="pageChange"
        />
      </div>
    </div>
  </ElScrollbar>
</template>

<script setup lang="ts">
import { count } from 'console'
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
  type?: 'date' | 'default' | 'image' | 'select' | 'tag' | 'switch'
  sort?: boolean | 'desc' | 'esc'
  align?: 'left' | 'center' | 'right'
  width?: string
  options?: any // 只有当prop 是select的时候才有用
  fixed?: boolean | 'left' | 'right'
  event?: (e: any, row: any) => void // 只有当prop 是select的时候才有用
  labelWidth?: string
  searcherPlaceHolder?: string
  opTrans?:(data:any)=>any
}[]
export type TableActionType = {
  title: string
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  event?: (row: any) => void
  link?: boolean
  confirmTitle?: string
}[]
const props = withDefaults(
  defineProps<{
    colums: TableColumType
    action?: TableActionType
    request?: (pramData: any) => [any, number]
    pageSize?: number
    isSelect?: boolean
  }>(),
  {
    pageSize: 10,
  },
)

const data = ref([])
const searcherParam = ref<Record<string, any>>({
  pageSize: props.pageSize,
  pageCount: 1,
})
const loading = ref(false)
const total = ref<number>(0)
const selectValue = ref<any>([])
onMounted(async () => {
  if (!props.request) return
  await request()
})

const selectChange = (value: any) => {
  if (!props.isSelect) return
  selectValue.value = value
}

// 请求
const request = async () => {
  if (!props.request) return
  selectValue.value = []
  loading.value = true
  ;[data.value, total.value] = await props.request?.(toRaw(searcherParam.value))
  loading.value = false
}

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

const pageChange = (count: number) => {
  searcherParam.value.pageCount = count
  request()
}

// 过来搜索
const searcheProps = computed(() => props.colums.filter(c => c.isSearch))

const reset = async () => {
  searcherParam.value = Object.assign(
    { pageSize: props.pageSize, pageCount: 1 },
    [...Object.keys(searcherParam.value)]
      .filter(k => ['DESC', 'ASC'].includes(searcherParam.value[k]))
      .reduce((p, k) => Object.assign(p, { [k]: searcherParam.value[k] }), {}),
  )

  await request()
}

const filteChangeHanle = async (pram: any) => {
  Object.assign(searcherParam.value, pram, {
    pageSize: props.pageSize,
    pageCount: 1,
  })
  await request()
}

const sortHandle = ({ prop, order }: any) => {
  // 'descending' |'ascending'

  switch (order) {
    case 'descending':
      searcherParam.value[prop] = 'DESC'
      break
    case 'ascending':
      searcherParam.value[prop] = 'ASC'
      break
    default:
      searcherParam.value[prop] = undefined
      break
  }

  request()
}

defineExpose({ request, reset, selectValue })
</script>

<style lang="scss" scoped></style>
