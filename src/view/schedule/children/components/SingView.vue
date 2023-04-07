<template>
  <div v-if="!isHistory">
    <div class=" mb-3">
      <SendTask @submit="resetable">
        <el-button type="primary">
          创建签到
        </el-button>
      </SendTask>
    </div>
    <div>
      <el-card class=" mb-6">
        <template #header>
          <div class=" flex justify-between px-4 items-center mb-3">
            <div class=" text-green-700 text-lg font-bold">
              签到中
            </div>
            <el-icon size="25" class=" cursor-pointer" @click="runRef.reset()">
              <RefreshLeft />
            </el-icon>
          </div>
        </template>
        <Table :action="runAction" ref="runRef" :colums="timingColum" :request="runRequest">
          <template #courseName="{ row }">
            {{ row?.classSchedule?.course?.courseName }}
          </template>
          <template #integral="{ row }">
            {{ row?.integral }}秒
          </template>
          <template #className="{ row }">
            {{ row?.classSchedule?.class?.className }}
          </template>
          <template #locationName="{ row }">
            {{ row.locationName ?? row?.area?.areaName }}
          </template>
        </Table>
      </el-card>
      <el-card>
        <template #header>
          <div class=" flex justify-between px-4 items-center mb-3">
            <div class=" text-yellow-700 text-lg font-bold">
              待签到
            </div>
            <el-icon size="25" class=" cursor-pointer" @click="singRef.reset()">
              <RefreshLeft />
            </el-icon>
          </div>


        </template>
        <Table :action="timingAction" ref="singRef" :colums="timingColum" :request="request">
          <template #courseName="{ row }">
            {{ row?.classSchedule?.course?.courseName }}
          </template>
          <template #integral="{ row }">
            {{ row?.integral }}秒
          </template>
          <template #className="{ row }">
            {{ row?.classSchedule?.class?.className }}
          </template>
          <template #locationName="{ row }">
            {{ row.locationName ?? row?.area?.areaName }}
          </template>
        </Table>
      </el-card>
    </div>
  </div>
  <div v-else>
    <Table :action="hisoryAction" ref="singRef" :colums="timingColum.slice(0, -1).filter(t => t.prop !== 'isRun')"
      :request="request">
      <template #courseName="{ row }">
        {{ row?.classSchedule?.course?.courseName }}
      </template>
      <template #integral="{ row }">
        {{ row?.integral }}秒
      </template>
      <template #className="{ row }">
        {{ row?.classSchedule?.class?.className }}
      </template>
      <template #locationName="{ row }">
        {{ row.locationName ?? row?.area?.areaName }}
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">

import { TableActionType, TableColumType } from '@/components/Table.vue';
import { getCurrentTask, getSingTask } from '@/http/api/singTask';
import { RefreshLeft } from '@element-plus/icons-vue'
const props = defineProps<{ isHistory: boolean }>()
const singRef = ref<any>()
const runRef = ref<any>()


const timingAction: TableActionType = [
  {
    type: 'primary',
    title: '编辑',
    link: true,
    event(row) {

    },
  },
  {
    type: 'danger',
    title: '结束',
    confirmTitle: '确认结束',
    link: true,
    async event(row: any) {
      //endTaskTiming

      singRef.value.reset()
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
      //  await delTaskTiming({ timingId: row.timingId })
      singRef.value.reset()

    },
  }, {
    type: 'primary',
    title: '查看',
    link: true,
    async event(row: any) {
      //  await delTaskTiming({ timingId: row.timingId })
      singRef.value.reset()

    },
  },
]
const timingColum: TableColumType = [
  { prop: 'taskName', label: '任务名称' },
  { prop: 'courseName', label: '课程', isSearch: true },
  { prop: 'className', label: '班级', isSearch: true },
  { prop: 'sustain', label: '分数' },
  {
    prop: 'isRun',
    label: '状态',
    type: 'tag',
    opTrans: (data: any) => Number(!!data),
    options: {
      0: {
        txt: '未签到',
        type: 'warning',
      },
      1: {
        txt: '签到中',
        type: 'success',
      },
    },
  },
  { prop: 'taskTime', label: '签到时间', type: 'date' },
  { prop: 'locationName', label: '签到地址' },
  { prop: 'integral', label: '持续时间' },

  {
    prop: 'isFace',
    label: '人脸识别',
    type: 'switch',
    async event(nv: boolean, row: any) {
      // await updateTaskTiming({ timingId: row.timingId,isFace:nv })
      row.isFace = nv
    },
  }
]


const runAction: TableActionType = [
  {
    type: 'danger',
    title: '结束',
    confirmTitle: '确认结束',
    link: true,
    async event(row: any) {
      //endTaskTiming

      singRef.value.reset()
    },
  },
]

watch(() => props.isHistory, async () => {
  singRef.value.reset()
})

const request = async (params: any) => {
  const {
    data: { count, rows },
  } = await getSingTask({ ...params, isHistory: props.isHistory })


  return [rows ?? [], count ?? 0]
}


const resetable = () => {
  singRef.value.reset()
  runRef.value.reset()
}

const runRequest = async (params: any) => {
  const {
    data: { count, rows },
  } = await getCurrentTask(params)


  return [rows ?? [], count ?? 0]
}



</script>

<style scoped lang="scss"></style>