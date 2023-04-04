<template>
  <div>
    <el-row>
      <el-col :span="3" class="bg-slate-400"
        ><div class="grid-content ep-bg-purple-dark"
      /></el-col>
      <el-col
        :span="3"
        v-for="k in weekKey"
        :key="k"
        class="even:bg-red-300 odd:bg-fuchsia-400 h-12 flex items-center justify-center text-center"
        ><div>
          {{ WeekNum[k] }}
        </div></el-col
      >
    </el-row>

    <el-row
      v-for="{ timeId, startTime, endTime, id } in timeList"
      :key="timeId"
      class="h-16 border-orange-500 border-solid"
    >
      <el-col
        :span="3"
        class="bg-slate-300 flex flex-col justify-center items-center justify-center border-r-2 border-fuchsia-600"
        ><div class="text-xs text-blue-500">第{{ id }}节课</div>
        <div>{{ startTime ?? '未知' }} - {{ endTime ?? '未知' }}</div></el-col
      >
      <el-col
        @click="clickHandle(k, id)"
        :span="3"
        v-for="k in weekKey"
        :key="k"
        class="truncate overflow-ellipsis flex items-center justify-center cursor-pointer border-t-2 border-r-2 border-fuchsia-600"
        :class="{ 'border-b-2': id === 11 }"
      >
        <div
          v-if="getHours(k, id)"
          class="w-full h-full bg-green-300 flex items-center justify-center flex-col relative"
          :class="{
            'bg-sky-400':
              getHours(k, id)?.classScheduleId === schedule?.classScheduleId,
          }"
        >
          <div>{{ getHours(k, id)?.courseName }}</div>
          <div class="text-xs text-orange-600">
            [{{ getHours(k, id)?.user?.userName }}]
          </div>
          <el-icon
            @click.stop="removeHours(getHours(k, id)?.classHoursId)"
            v-if="
              getHours(k, id)?.classScheduleId === schedule?.classScheduleId
            "
            :size="20"
            class="right-1 top-1"
            style="position: absolute"
            ><Close
          /></el-icon>
        </div>
        <div v-else class="bg-sky-200 w-full h-full"></div>
      </el-col>
    </el-row>
    <el-dialog
      v-model="innerVisible"
      width="30%"
      :title="WeekNum[selectKey!]"
      append-to-body
      align-center
      @close=";(formSelect = defaultConf()), (selectKey = undefined)"
    >
      <div>
        <div>设置课程</div>
        <div class="flex items-center ml-4 my-4 text-lg font-bold">
          <!-- <el-select
              v-model="formSelect.id"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in 11"
                :key="item"
                :label="'第' + item + '节课'"
                :value="item"
              />
            </el-select> -->
          第 {{ formSelect.id }} 节课
        </div>

        <div class="border-2 border-red-500 w-max px-4 mb-6">
          <div>
            <span>是否开启定时签到</span>
            <el-switch
              v-model="formSelect.isPeriod"
              class="ml-2"
              style="--el-switch-on-color: #13ce66"
            />
          </div>
          <div class="my-3" v-if="formSelect.isPeriod">
            是否开启人脸签到
            <el-switch
              v-model="formSelect.isFace"
              class="ml-2"
              style="--el-switch-on-color: #13ce66"
            />
          </div>
          <div class="my-3" v-if="formSelect.isPeriod">
            持续
            <el-input-number v-model="formSelect.keepTime" :min="1" :max="10" />
            分钟
          </div>
          <div class="my-3" v-if="formSelect.isPeriod">
            签到分数
            <el-input-number v-model="formSelect.sustain" :min="1" :max="10" />
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="innerVisible = false">取消</el-button>
          <el-button type="primary" @click="setHours"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
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
import { CirclePlus, CircleClose, Close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
export type SchoolTimeType = Record<keyof typeof WeekNum, string[]>

const props = defineProps<{ schedule?: any; classId: string }>()
const employhourseList = ref<any>([])
const selectKey = ref<keyof typeof WeekNum>()
const defaultConf = () => ({
  id: undefined,
  isPeriod: false,
  keepTime: 1,
  sustain: 1,
  isFace: false,
})

let isUpdate = false

const formSelect = ref<any>(defaultConf())
const timeList = ref<any>([])
const innerVisible = ref(false)
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
    .map(({ classHours, course }: any) =>
      classHours && classHours.length === 0
        ? []
        : classHours.map((cl: any) => ({ ...cl, ...course })),
    )
    .flat(Infinity)
}

const getHours = computed(
  () => (day: any, did: any) =>
    employhourseList.value.find(
      ({ weekDay, time }: any) => weekDay === day && time?.id === did,
    ),
)

const setHours = async () => {
  if (isUpdate) {
    await updateHourse({
      isPeriod: formSelect.value.isPeriod,
      keepTime: formSelect.value.keepTime ?? 1,
      isFace: formSelect.value.isFace,
      classHoursId: formSelect.value.classHoursId,
      classScheduleId: props.schedule.classScheduleId,
      sustain: formSelect.value.sustain,
    })
  } else {
    await addHourse({
      isPeriod: formSelect.value.isPeriod,
      keepTime: formSelect.value.keepTime ?? 1,
      weekDay: selectKey.value,
      classScheduleId: props.schedule.classScheduleId,
      timeId: timeList.value.find((t: any) => t.id === formSelect.value.id)
        ?.timeId,
      isFace: formSelect.value.isFace,
      sustain: formSelect.value.sustain,
    })
  }

  await getdata()
  innerVisible.value = false
  formSelect.value = defaultConf()
}

const removeHours = (id: string) => {
  ElMessageBox.confirm('确认删除该课程?', '确认删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await delHourse(id)
    await getdata()
  })
}
const checkTime = (k: keyof typeof WeekNum, id: any) => {
  innerVisible.value = true
  selectKey.value = k
  formSelect.value = { id, keepTime: 1, isFace: true, sustain: 1 }
}

// 更新数据
const update = (data: any, k: keyof typeof WeekNum, id: any) => {
  selectKey.value = k
  formSelect.value = { id }

  if (data.timing) {
    formSelect.value.isPeriod = data.timing?.isPeriod ?? false
    formSelect.value.keepTime = (data.timing.integral ?? 60) / 60
    formSelect.value.isFace = data.timing.isFace ?? false
    formSelect.value.sustain = data.timing.sustain ?? 1
  }
  formSelect.value.classHoursId = data.classHoursId
  innerVisible.value = true
}

const clickHandle = (k: keyof typeof WeekNum, id: any) => {
  isUpdate = false
  // 是否是空位
  if (!getHours.value(k, id)) {
    checkTime(k, id)
    return
  }

  if (
    getHours.value(k, id)?.classScheduleId === props.schedule.classScheduleId
  ) {
    isUpdate = true
    update(getHours.value(k, id), k, id)
  }
}
</script>

<style scoped lang="scss"></style>
