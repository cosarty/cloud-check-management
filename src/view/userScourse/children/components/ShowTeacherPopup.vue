<template>
  <ElDialog v-model="dialogVisible" destroy-on-close @closed="close">
    <div class=" text-center">
      <ElSelect v-model="classId" class="w-full" placeholder="选择班级">
        <ElOption :label="op.className" :value="op.classId" v-for="op in classList" :key="op.classId" />
      </ElSelect>
    </div>

    <div class="h-96 mt-14">
      <VChart :option="option" autoresize />
    </div>
  </ElDialog>
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
import { getTeacherClass, getTeacherCourse } from '@/http/api'

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const staDta = ref<any>({})
const dialogVisible = ref(false)
const userId = ref()
const classId = ref()
const close = () => {
  userId.value = undefined
  classId.value = undefined

}
const classList = ref<any>([])

defineExpose({
  show: (id: string) => {

    userId.value = id
    dialogVisible.value = true
  }
})


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


watch([userId, classId], async () => {
  if (userId.value && classId.value) {
    const { data } = await getTeacherCourse({ classId: classId.value, userId: userId.value })
    staDta.value = data
  }
})
watch(userId, async () => {
  if (userId.value) {
    const { data } = await getTeacherClass({ userId: userId.value })
    classList.value = data
    classId.value = data?.[0]?.classId

  }

})

</script>

<style scoped></style>