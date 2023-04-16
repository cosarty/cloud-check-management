<template>
  <div style="background-color: white; height: 100%">
    <div class="m-4 flex justify-between">
      <div class="font-bold text-lg">课程列表</div>
      <ElButton type="primary">查看课表</ElButton>
    </div>
    <div><RenderCourse :data="courseList" @action="showScourse" /></div>

    <VChart class=" h-96 w-96" :option="option" autoresize />
  </div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '课程',
  icon: 'icon-xuesheng',
  name: 'stdentClass',
  auth: 'student',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import RenderCourse from '@/components/RenderCourse/index.vue'
import { getStudentClass } from '@/http/api'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);




const option = ref({
  title: {
    text: 'Traffic Sources',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: { 
    orient: 'vertical',
    left: 'left',
    data: ['Direct', 'Ema', 'Ad Networks', 'Video Ads', 'Search Engines'],
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['60%', '60%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Ema' },
        { value: 234, name: 'Ad Networks' },
        { value: 135, name: 'Video Ads' },
        { value: 1548, name: 'Search Engines' },
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
});


const router = useRouter()
const courseList = ref<any>([])
onMounted(() => {
  getStudentClass().then(({ data }) => {
    courseList.value = data.map(({ class: cls, ...res }: any) => ({
      ...res,
      ClassSchedule: cls?.[0]?.ClassSchedule,
    }))
  })
})

const showScourse = (comd: string, data: any) => {
  if (comd === 'show') {
    router.push({
      name: 'scoursInfo',
      query: { courseId: data.ClassSchedule.classScheduleId },
    })
  }
}
</script>

<style scoped></style>
