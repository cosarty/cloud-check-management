<template>
  <div>
    <div class="h-96 mt-14">
      <VChart :option="option" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { getClassStat } from '@/http/api'

const props = defineProps<{ userId?: string, classId: string }>()
const staDta = ref<any>({})
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: staDta.value?.name ?? []
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '缺勤',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: staDta.value?.value?.[2] ?? []
    },
    {
      name: '签到',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: staDta.value?.value?.[1] ?? []
    },
    {
      name: '迟到',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: staDta.value?.value?.[0] ?? []
    }
  ]
}))


watch(props, async () => {
  const { data } = await getClassStat(props.classId, { userId: props.userId })
  staDta.value = data
}, {
  deep: true,
  immediate: true
})

</script>

<style scoped lang="scss">
.el-col {
  text-align: center;
}
</style>