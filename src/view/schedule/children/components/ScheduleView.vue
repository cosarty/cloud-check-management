<template>
  <div>
    <Table
      :action="props.isHistory ? hisoryAction : timingAction"
      ref="timingRef"
      :colums="
        props.isHistory
          ? timingColum.slice(0, -2).filter(d => d.prop !== 'taskTime')
          : timingColum
      "
      :request="request"
    >
      <template #courseName="{ row }">
        {{ row?.classSchedule?.course?.courseName }}
      </template>
      <template #integral="{ row }"> {{ row?.integral }}秒 </template>
      <template #className="{ row }">
        {{ row?.classSchedule?.class?.className }}
      </template>
      <template #locationName="{ row }">
        {{ row?.locationName ?? row?.area?.areaName }}
      </template>
      <template #taskTime="{ row }">
        {{
          '(星期 ' +
          row?.classHours?.time?.id +
          ') ' +
          row?.classHours?.time?.startTime
        }}
      </template>
    </Table>
    <SendTimingTask ref="sendTimingRef" @submit="timingRef.reset()" />
  </div>
</template>

<script setup lang="ts">
import { TableActionType, TableColumType } from '@/components/Table.vue'
import {
  delTaskTiming,
  endTaskTiming,
  getTimingList,
  updateTaskTiming,
} from '@/http/api'
const props = defineProps<{ isHistory: boolean }>()
const timingRef = ref<any>()
const sendTimingRef = ref<any>()

const getTimingTask = async (params: any = {}) => {
  const data = await getTimingList({ isHistory: props.isHistory, ...params })
  return data
}

const timingAction: TableActionType = [
  {
    type: 'primary',
    title: '编辑',
    link: true,
    event(row) {
      sendTimingRef.value.updateInfo({ ...row })
    },
  },
  {
    type: 'danger',
    title: '结束',
    confirmTitle: '确认结束',
    link: true,
    async event(row: any) {
      //endTaskTiming
      await endTaskTiming({ timingId: row.timingId })
      timingRef.value.reset()
    },
  },
]

const hisoryAction: TableActionType = [
  {
    type: 'danger',
    title: '删除',
    confirmTitle: '确认删除',
    link: true,
    async event(row: any) {
      await delTaskTiming({ timingId: row.timingId })
      timingRef.value.reset()
    },
  },
]
const timingColum: TableColumType = [
  { prop: 'taskName', label: '任务名称' },
  { prop: 'courseName', label: '课程', isSearch: true },
  { prop: 'className', label: '班级', isSearch: true },
  { prop: 'sustain', label: '分数' },
  {
    prop: 'isEnd',
    label: '状态',
    type: 'tag',
    opTrans: (data: any) => Number(!!data),
    options: {
      1: {
        txt: '已结束',
        type: 'warning',
      },
      0: {
        txt: '运行中',
        type: 'success',
      },
    },
  },
  { prop: 'taskTime', label: '签到时间' },
  { prop: 'integral', label: '持续时间' },
  { prop: 'period', label: 'corntab' },
  { prop: 'locationName', label: '签到地址' },
  { prop: 'distance', label: '签到距离(米)' },
  {
    prop: 'isFace',
    label: '人脸识别',
    type: 'switch',
    async event(nv: boolean, row: any) {
      await updateTaskTiming({ timingId: row.timingId, isFace: nv })
      row.isFace = nv
    },
  },
  {
    prop: 'isPeriod',
    label: '定时',
    type: 'switch',
    async event(nv: boolean, row: any) {
      await updateTaskTiming({ timingId: row.timingId, isPeriod: nv })

      row.isPeriod = nv
    },
  },
]

watch(
  () => props.isHistory,
  async () => {
    timingRef.value.reset()
  },
)

const request = async (params: any) => {
  const {
    data: { count, rows },
  } = await getTimingTask(params)

  return [rows ?? [], count ?? 0]
}
</script>

<style scoped lang="scss"></style>
