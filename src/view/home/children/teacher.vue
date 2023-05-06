<template>
  <ElScrollbar v-loading="loading">
    <div class="grid md:grid-cols-4 gap-3 ">
      <el-card shadow="hover" :body-style="{ padding: '20px' }" v-for="(card, index) of cards" :key="index"
        class="cursor-pointer">
        <template #header>
          <div class="flex justify-between items-center">
            {{ card.title }}
            <el-tag type="danger" size="small" effect="dark">总</el-tag>
          </div>
        </template>

        <section class="flex mt-3 justify-between items-center">
          <span class="text-3xl">{{ card.total }}</span>
          <i :class="[card.icon, card.iconColor]" class="text-5xl"></i>
        </section>

      </el-card>
    </div>
    <div class="grid md:grid-cols-3 gap-7 mt-10">
      <el-card shadow="hover" :body-style="{ padding: '20px' }" v-for="(card, index) of ranking" :key="index"
        class="cursor-pointer">
        <template #header>
          <div class="flex justify-between items-center">
            {{ card.title }}

          </div>
        </template>


        <div class="flex mt-3 justify-between items-center flex-col demo-progress ">
          <template v-for="(v, index) in card.value" :key="index">
            <div class=" self-start mb-1 mr-1 text-xs flex items-center"><span
                :style="{ color: 'white', backgroundColor: colors[index], padding: '3px  6px' }" class=" mr-1">
                {{ index + 1 }}
              </span>
              <div class=" text-slate-500">
                {{ v.name }}({{ v.comment }})
              </div>
            </div>
            <el-progress :percentage="Math.round(v.ratio * 100)" :format="format" :color="colors[index]" />
          </template>
        </div>
      </el-card>
      <div class=" col-span-2 bg-white">
        <ClassDiagram :options="homeInfo.statInfo"></ClassDiagram>
      </div>
    </div>
  </ElScrollbar>
</template>
<script lang="ts">
export default defineComponent({
  auth: 'teacher',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts">
import { getTeacherHome } from '@/http/api';
import ClassDiagram from '@/components/ClassDiagram.vue';
const homeInfo = ref<any>({})
const loading = ref(false)



const cards = computed(() => [
  {
    title: '课程数',
    total: homeInfo.value.course ?? 0,
    iconColor: 'text-violet-500',
    icon: 'fas fa-address-card',

  },
  {
    title: '授课班级数',
    total: homeInfo.value.classNum ?? 0,
    iconColor: 'text-green-600',
    icon: 'fas fa-apple-alt',

  },
  {
    title: '定时任务数',
    total: homeInfo.value.singTaskNum ?? 0,
    iconColor: 'text-blue-500',
    icon: 'fas fa-award',

  },
  {
    title: '轮询任务数',
    total: homeInfo.value.timingNum ?? 0,
    iconColor: 'text-red-500',
    icon: 'fas fa-baseball-ball',

  }
])

const colors = ['#0EA5E9', 'rgb(45 212 191/1)', ' rgb(163 230 53 /1)', ' rgb(167 139 250 /1)', ' rgb(253 224 71 /1)', ' rgb(236 72 153 / 1)']

const ranking = computed(() => [
  {
    title: '最受欢迎课程TOP',
    value: homeInfo.value.schduleRatio ?? []
  }
])
const format = (percentage: any) => (percentage > 100 ? 'Full' : `${percentage}%`)
onMounted(async () => {
  loading.value = true
  const { data } = await getTeacherHome()
  console.log('data: ', data);
  homeInfo.value = data
  loading.value = false
})
</script>

<style scoped lang="scss">
.demo-progress .el-progress--line {
  margin-bottom: 5px;
  width: 100%;
}
</style>
