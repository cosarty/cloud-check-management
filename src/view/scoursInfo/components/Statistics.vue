<template>
  <div class="flex max-w-full justify-around px-2 pt-6">
    <VChart
      class="h-96 basis-2/5 px-2 box-border flex-shrink-1"
      :option="option"
      autoresize
    />
    <VChart
      class="h-96 basis-2/5 px-2 box-border flex-shrink-1"
      :option="option2"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { statList } from '@/http/api'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

const props = defineProps<{ classScheduleId: string; userId?: string }>()

watch(
  () => props,
  async () => {
    if (props.userId) {
      const { data } = await statList({ ...props })
      console.log('data: ', data)
    }
  },
  {
    deep: true,
  },
)
const option = ref({
  title: {
    text: '参与度',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['迟到', '缺勤', '签到'],
  },
  series: [
    {
      name: '考勤统计',
      type: 'pie',
      radius: '55%',
      center: ['43%', '50%'],
      data: [
        // { value: 335, name: '缺勤' },
        { value: 310, name: '迟到' },
        { value: 234, name: '签到' },
        { value: 135, name: '缺勤' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

const option2 = ref({
  title: {
    text: '积分',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'right',
    data: ['我的', '总积分'],
  },
  series: [
    {
      name: '积分统计',
      type: 'pie',
      radius: '55%',
      center: ['52%', '50%'],
      data: [
        // { value: 335, name: '缺勤' },
        { value: 310, name: '我的' },
        { value: 234, name: '总积分' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})
</script>

<style scoped></style>
