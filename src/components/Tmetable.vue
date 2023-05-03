<template>
  <div class=" text-center mb-6"> <el-date-picker v-model="dateWeek" type="week" :clearable="false" format=" ww 周"
      placeholder="Pick a week" /></div>
  <div class="flex " style="height: 94%;">
    <el-descriptions class=" basis-60 mr-8" title="课程列表" :column="3" border>

      <template v-for="({ classScheduleId, course, starDate, endDate }) in courseInfo" :key="classScheduleId">
        <el-descriptions-item>
          <template #label>
            <div class=" whitespace-nowrap">
              课程名称
            </div>
          </template>
          <div class=" whitespace-nowrap"> {{ course.courseName }}</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">

              startTime
            </div>
          </template>
          {{ dayjs(starDate).format('YYYY-MM-DD') }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              endTtime
            </div>
          </template>
          {{ dayjs(endDate).format('YYYY-MM-DD') }}
        </el-descriptions-item>

      </template>
    </el-descriptions>
    <div class=" flex-grow">
      <ElScrollbar>
        <el-row>
          <el-col :span="3" class="bg-slate-400">
            <div class="grid-content ep-bg-purple-dark" />
          </el-col>
          <el-col :span="3" v-for="k in weekKey" :key="k"
            class="even:bg-red-300 odd:bg-fuchsia-400 h-12 flex items-center justify-center text-center">
            <div>
              {{ WeekNum[k] }}
            </div>
          </el-col>
        </el-row>

        <el-row v-for="{ timeId, startTime, endTime, id } in timeList" :key="timeId"
          class="h-16 border-orange-500 border-solid">
          <el-col :span="3"
            class="bg-slate-300 flex flex-col justify-center items-center justify-center border-r-2 border-fuchsia-600">
            <div class="text-xs text-blue-500">第{{ id }}节课</div>
            <div>{{ startTime ?? '未知' }} - {{ endTime ?? '未知' }}</div>
          </el-col>
          <el-col :span="3" v-for="k in weekKey" :key="k"
            class="truncate overflow-ellipsis flex items-center justify-center cursor-pointer border-t-2 border-r-2 border-fuchsia-600"
            :class="{ 'border-b-2': id === 11 }">
            <div v-if="getHours(k, id)"
              class="w-full h-full bg-green-300 flex items-center justify-center flex-col relative" :class="{
                  'bg-sky-400': true
                }">
              <div>{{ getHours(k, id)?.courseName }}</div>
              <div class="text-xs text-orange-600">
                [{{ getHours(k, id)?.user?.userName }}]
              </div>
              <el-icon @click.stop v-if="getHours(k, id)?.classScheduleId === schedule?.classScheduleId
                " :size="20" class="right-1 top-1" style="position: absolute">
                <Close />
              </el-icon>
            </div>
            <div v-else class="bg-sky-200 w-full h-full"></div>
          </el-col>
        </el-row>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WeekNum } from '@/enum/weekEnum'
import {
  addHourse,
  checkClassCourse,
  delHourse,
  getTime,
  updateHourse,
} from '@/http/api'
import { Close } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
export type SchoolTimeType = Record<keyof typeof WeekNum, string[]>
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'

const dateWeek = ref(new Date())
const props = defineProps<{ schedule?: any; classId: string }>()
const employhourseList = ref<any>([])
const courseInfo = ref()
dayjs.extend(weekday)
dayjs.extend(isBetween)
const week = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,

} as any
// const curretnWeek = computed(() => [dayjs(dateWeek.value).startOf('week').format('YY-MM-DD'), dayjs(dateWeek.value).endOf('week').format('YY-MM-DD')])
const curretnWeek = computed(() => dayjs(dateWeek.value).startOf('week'))

const timeList = ref<any>([])

onMounted(async () => {
  await getTime().then(({ data }) => {
    timeList.value = data
  })
  await getdata()
})
onUnmounted(() => {
  employhourseList.value = []
})
const weekKey = computed(
  () => [...Object.keys(WeekNum)] as (keyof typeof WeekNum)[],
)

// 获取课程信息
const getdata = async () => {
  const { data } = await checkClassCourse(props.classId)



  employhourseList.value = data
    .map(({ classHours, course, ...otherInfo }: any) =>
      classHours && classHours.length === 0
        ? []
        : classHours.map((cl: any) => ({ ...cl, ...course, ...otherInfo })),
    )
    .flat(Infinity)
  console.log('data: ', data);
  courseInfo.value = data

}

const getHours = computed(
  () => (day: any, did: any) => {

    // curretnWeek

    const data = employhourseList.value.find(
      ({ weekDay, time }: any) => weekDay === day && time?.id === did,
    )

    if (!data) return null

    const isPass = curretnWeek.value.weekday(week[day]).isBetween(dayjs(data.starDate), dayjs(data.endDate))

    if (!isPass) return null
    return data
  }
  ,
)


watch(props, async () => {
  await getdata()
}, { deep: true })


</script>

<style scoped lang="scss"></style>
