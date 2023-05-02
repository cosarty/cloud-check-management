<template>
  <el-row class="h-96 p-4 pt-8" :gutter="20">
    <el-col :span="12"><VChart :option="option" autoresize /></el-col>
    <el-col :span="12">
      <VChart ref="echarts" :option="option2" autoresize
    /></el-col>
  </el-row>
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
const echartsData = ref<any>({})
const echarts = ref()
const opComp = computed(() => {
  const { all = 0, info = [] } = echartsData.value
  return [
    {
      value: info.filter((pre: any) => pre.type === 0)?.[0]?.count ?? 0,
      name: '迟到',
    },
    {
      value: info.filter((pre: any) => pre.type === 1)?.[0]?.count ?? 0,
      name: '签到',
    },
    {
      value: all - info.reduce((pre: any, nxt: any) => pre + nxt.count, 0),
      name: '缺勤',
    },
  ]
})
const op2Comp = computed(() => {
  const { allintegral = { sustains: 0 }, integral = [] } = echartsData.value

  const intt = integral.reduce((pre: any, nxt: any) => {
    if (nxt.type === 1) {
      return (pre += +nxt?.sustains ?? 0)
    }
    if (nxt.type === 0) {
      return (pre = pre + (+nxt?.sustains ?? 0) * 0.5)
    }
  }, 0)

  return [
    {
      value: intt,
      name: titleComp.value[0],
    },
    {
      value: allintegral.sustains,
      name: '总积分',
    },
  ]
})
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
    formatter: (...res: any) => {
      const data = option.value.series[0].data

      switch (res[0]) {
        case '迟到':
          return '迟到：' + data[0].value
        case '签到':
          return '签到:' + data[1].value
        case '缺勤':
          return '缺勤:' + data[2].value
      }
    },
  },
  series: [
    {
      name: '考勤统计',
      type: 'pie',
      radius: '55%',
      center: ['43%', '50%'],
      data: opComp,
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

const titleComp = computed(() => [props.userId ? '我的' : '积分基数', '总积分'])

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
    data: titleComp,
    formatter: (...res: any) => {
      const data = option2.value.series[0].data

      switch (res[0]) {
        case '我的':
        case '积分基数':
          return res[0]+':' + data[0].value

        case '总积分':
          return '总积分:' + data[1].value
      }
    },
  },
  series: [
    {
      name: '积分统计',
      type: 'pie',
      radius: '55%',
      center: ['52%', '50%'],
      data: op2Comp,
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

watch(
  () => props,
  async () => {
    await nextTick()
    //  console.log(echarts.value)

    const { data } = await statList({ ...props })
    echartsData.value = data
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<style scoped></style>
