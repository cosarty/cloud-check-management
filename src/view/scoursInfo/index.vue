<template>
  <div style="background-color: white; height: 100%" class="overflow-hidden box-border max-w-7xl mx-auto flex flex-col">
    <!-- <ElButton @click="submit">发起签到</ElButton> -->
    <div class="flex items-center p-5 pl-24 bg-slate-300">
      <ElImage class="h-36 w-36 rounded-full border-orange-600 border-2 object-cover shadow-sm"
        :src="courseInfo?.course?.picture ?? emtyCourse" :class="{ fix: courseInfo?.course?.picture }">
      </ElImage>
      <div class="ml-3 self-start mt-5 ml-5">
        <div class="font-bold text-2xl">
          {{ courseInfo?.course?.courseName }}
        </div>
        <div>
          <div class="mt-3 text-slate-500 text-sm">
            {{ courseInfo?.class?.className }}
          </div>
          <div></div>
        </div>
      </div>

      <div class="ml-auto mr-6 -mt-16">
        <SendTask v-if="!isStudent" ref="sendTaskRef" @submit="submit" :class-schedule-id="courseId">
          <ElButton type="primary">发起签到</ElButton>
        </SendTask>
      </div>
    </div>
    <div class="px-64 -mt-16">
      <el-tabs v-model="activeName" @tab-change="tabChange">
        <el-tab-pane label="成员" name="member"></el-tab-pane>
        <el-tab-pane label="活动" name="schdule"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="h-4 flex-grow flex" v-if="activeName === 'member'">
      <div class="basis-80 shrink-0 overflow-hidden border-solid border-r-2 border-neutral-500">
        <ElScrollbar>
          <div>
            <div v-if="myInfo" class="p-2 bg-amber-200 flex items-center border-b-2 cursor-pointer">
              <span class="w-5 h-5 rounded-full text-sm text-center mr-2 bg-red-300 text-white">{{ myInfo?.idx }}</span>
              <ElAvatar :size="40" :src="myInfo?.info?.pic ??
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                " />

              <div class="text-xs ml-2">
                <div>{{ myInfo?.info?.userName }}</div>
                <div class="text-gray-700 mt-1">
                  {{ myInfo?.info?.account }}
                </div>
              </div>
              <div class="text-xs ml-auto flex items-center">
                经验值:<span class="ml-1 text-lg text-orange-500">{{
                  myInfo?.info?.sustain
                }}</span>
              </div>
            </div>
            <div class="p-2 flex items-center border-b-2 cursor-pointer" :class="{
                  'bg-amber-200': activeStudent === ot.userId,
                  'bg-slate-100': activeStudent !== ot.userId,
                }" v-for="(ot, index) in otherInfo" :key="ot.userId" @click="!myInfo && checkUser(ot.userId)">
              <span class="w-5 h-5 rounded-full text-sm text-center mr-2 bg-red-300 text-white">{{
                myInfo?.idx
                ? index >= myInfo?.idx - 1
                  ? index + 2
                  : index + 1
                : index + 1
              }}</span>
              <ElAvatar :size="40" :src="ot?.pic ??
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                  " />
              <div class="text-xs ml-2">
                <div>{{ ot?.userName }}</div>
                <div class="text-gray-700 mt-1">{{ ot?.account }}</div>
              </div>
              <div class="text-xs ml-auto flex items-center">
                经验值:<span class="ml-1 text-lg text-orange-500">{{
                  ot?.sustain
                }}</span>
              </div>
            </div>
          </div>
        </ElScrollbar>
      </div>
      <div class="flex-grow bg-white">
        <div class="bg-red-100 h-20 flex items-center justify-center" v-if="activeStudentInfo">
          <ElAvatar :size="50" :src="activeStudentInfo?.pic ??
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              " />

          <div class="text-lg mx-8 flex flex-col">
            <div>{{ activeStudentInfo?.userName }}</div>
            <div class="flex">
              <div class="text-gray-700 mt-1 text-xs">
                {{ activeStudentInfo?.account }}
              </div>
              <div class="text-gray-700 mt-1 text-xs ml-4">
                {{ activeStudentInfo?.email }}
              </div>
            </div>
          </div>

          <div>
            <ShowStudentPopup v-slot="{ show }" @update="getData">
              <ElButton link type="primary" @click="show(activeStudentInfo?.userId, activeStudentInfo?.userName, courseId, !!isStudent)
                " :icon="Tickets">经验值明细</ElButton>
            </ShowStudentPopup>
          </div>
        </div>
        <ElScrollbar>
          <Statistics :class-schedule-id="courseId" :user-id="activeStudentInfo?.userId"></Statistics>
        </ElScrollbar>
      </div>
    </div>

    <div class="h-4 mt-3 flex-grow flex flex-col" v-if="activeName === 'schdule'">
      <ElScrollbar>
        <div class="m-4 my-2">
          <el-radio-group v-model="radio" class="ml-3" @change="radioChange">
            <el-radio :label="0" size="large">进行中</el-radio>
            <el-radio :label="1" size="large">已结束</el-radio>
          </el-radio-group>
        </div>
        <div class="m-4 flex-1 bg-white rounded-lg">
          <!-- {{ singTaskinfo }} -->
          <div v-for="info in singTaskinfo" :key="info.singTaskId"
            class="flex mb-4 rounded-lg bg-blue-100 p-1 h-20 items-center max-w-3xl mx-auto">
            <ElImage :src="qiandao" class="w-12 h-12" />
            <div class="flex-grow flex flex-col pl-3 py-2 h-full">
              <div class="text-lg pb-2 flex items-center">
                <span class="mr-3"> {{ info.taskName }}</span>
                <el-tag type="danger" v-if="info.isEnd">已结束</el-tag>
                <el-tag type="success" v-else-if="!info.isEnd && info.isRun">签到中</el-tag>
                <el-tag type="warning" v-else-if="!info.isEnd && !info.isRun">等待签到</el-tag>
              </div>
              <div class="text-xs divide-x divide-yellow-600 divide-solid">
                <span class="px-2 pl-0">共{{ info.students?.filter(s => s.type !== null)?.length }}人参与</span><span
                  class="px-2">{{
                    dayjs(info.taskTime).format('YYYY-MM-DD HH:mm')
                  }}</span><span class="px-2">积分:{{ info.sustain }}</span><span class="px-2">持续时间:{{ info.integral
}}</span>
              </div>
            </div>
            <ElButton link type="primary" class="mr-3" @click="statClick(info)" v-if="!info.isEnd &&
              info.isRun &&
              isStudent &&
              !info?.students?.find(a => a.userId === user.userInfo.userId)
              ">签到</ElButton>

            <ElButton v-else-if="isStudent &&
              info?.students?.find(a => a.userId === user.userInfo.userId)
              " link type="success" class="mr-3" disabled>已签到</ElButton>
            <ElButton v-else-if="isStudent" type="warning" link>未签到</ElButton>

            <ElButton v-if="!info.isEnd && info.isRun && !isStudent" link type="danger" @click="endHendle(info)">结束
            </ElButton>
            <ShowStat v-slot="{ show }" v-if="!isStudent" @update="getSchdule">
              <ElButton link type="primary" class="mr-3" @click="show(info.singTaskId, info.taskName,courseId)">查看</ElButton>

            </ShowStat>
          </div>

          <div v-if="!singTaskinfo?.length" class="text-cyan-700 text-lg font-bold flex flex-col items-center">
            <ElImage :src="emptySchdule" class="my-4"></ElImage>
            暂无活动
          </div>
        </div>
      </ElScrollbar>
    </div>

    <MapPopUp @confirm="singStat" id="student-map" title="签到" is-student ref="studenMap">
    </MapPopUp>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '签到详情',
  icon: 'icon-kecheng',
  name: 'scoursInfo',
  auth: ['teacher', 'student'],
  hideMenu: true,
})
</script>
<script setup lang="ts">
import dayjs from 'dayjs'
import qiandao from '@/assets/qiandao.png'
import emptySchdule from '@/assets/empty_schdule.png'
import { checkCourse, createStat, getSchduleStudent } from '@/http/api'
import {
  createSingTask,
  getCurrentTask,
  getSingTask,
  singEndTask,
} from '@/http/api/singTask'
import userStore from '@/store/userStore'
import emtyCourse from '@/assets/emty-course.png'
import { Action, ElMessageBox } from 'element-plus'
import Statistics from './components/Statistics.vue'
import { Tickets } from '@element-plus/icons-vue'
import ShowStudentPopup from './components/ShowStudentPopup.vue'
import ShowStat from './components/ShowStat.vue'

const studenMap = ref<any>()
const activeStudent = ref()

const radio = ref(0)

const user = userStore()

const activeName = ref('member')

const singTaskinfo = ref<any[]>([])
// const close = closeCurrentTab()
const route = useRoute()
const courseId = ref<string>('')
const courseInfo = ref<any>({})
const students = ref<any>([])
const isStudent = computed(() => user.userInfo.auth?.includes('student'))

// 我的数据
const myInfo = computed(() => {
  if (!isStudent.value) return null

  let idx
  const info = students.value?.filter((s: any, index) => {
    if (s?.userId === user?.userInfo?.userId) {
      idx = index + 1
      return true
    }
    return false
  })?.[0]
  return { info, idx }
})

// 其他同学
const otherInfo = computed(() => {
  return (
    students.value?.filter((s: any) => s?.userId !== user?.userInfo?.userId) ??
    []
  )
})

// 获取当前的激活中的活动
const getActiveSchdule = async () => {
  const {
    data: { rows: run },
  } = await getCurrentTask({
    classScheduleId: courseId.value,
  })

  const {
    data: { rows: we },
  } = await getSingTask({
    isHistory: false,
    classScheduleId: courseId.value,
  })

  singTaskinfo.value = [...run, ...we]
}

// 获取已结束的活动
const getSchdule = async () => {
  const {
    data: { rows: noAc },
  } = await getSingTask({
    isHistory: true,
    classScheduleId: courseId.value,
  })



  singTaskinfo.value = [...noAc]
}

const tabChange = async (v: any) => {
  if (v === 'schdule') {
    if (radio.value === 1) {
      await getSchdule()
    }

    if (radio.value === 0) {
      await getActiveSchdule()
    }
  }
}
const radioChange = async (v: any) => {
  if (v === 1) {
    await getSchdule()
  }
  if (v === 0) {
    await getActiveSchdule()
  }
}

// 发起签到
const submit = async () => {
  if (radio.value === 0) {
    await getActiveSchdule()
  }
}

const statClick = async (info: any) => {
  // 如果已经结束了
  if (!dayjs(info.taskTime).add(info.integral, 'second').isAfter(dayjs())) {
    singTaskinfo.value = singTaskinfo.value.filter(
      (s: any) => s.singTaskId !== info.singTaskId,
    )
    ElMessage({
      message: '签到已结束.',
      type: 'warning',
    })
    return
  }

  // 判断是否开启人脸
  if (info.isFace) {
    ElMessageBox.alert('当前签到已开启人脸识别功能，请登录小程序签到', '提示', {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '确认',
      callback: (action: Action) => { },
    })

    return
  }
  // 判断是否开启定位

  if (info.area || (info.locationName && info.location)) {
    console.log('开启地图')

    if (info.location) {
      studenMap.value.updateData({
        ...info,
        ...JSON.parse(info.location),
        address: info.locationName,
      })
      return
    }

    if (info.area) {
      studenMap.value.updateData({
        ...info,
        ...JSON.parse(info.area.location),
        address: info.area.locationName,
      })

      return
    }

    return
  }

  // 如果都没有的话那就直接签到
  console.log('info: ', info)

  await createStat({
    singTaskId: info.singTaskId,
    type: 1,
    classScheduleId: courseId.value,
    sustain: info.sustain,
  })

  await getActiveSchdule()
}

// 区域签到
const singStat = async ({
  location,
  locationName,
  tagetScope,
  singTaskId,
  sustain,
}: any) => {
  await createStat({
    location: JSON.stringify(location),
    locationName,
    singTaskId,
    type: 1,
    classScheduleId: courseId.value,
    sustain,
    tagetScope,
  })

  await getActiveSchdule()
}

// 选择学生
const checkUser = (userId: any) => {
  if (activeStudent.value === userId) {
    activeStudent.value = undefined
  } else {
    activeStudent.value = userId
  }
}

const activeStudentInfo = computed(
  () =>
    otherInfo.value.find((o: any) => o.userId === activeStudent.value) ??
    myInfo.value?.info,
)

// 结束签到
const endHendle = async (info: any) => {
  await singEndTask({ singTaskId: info.singTaskId })
  singTaskinfo.value = singTaskinfo.value.filter(
    (s: any) => s.singTaskId !== info.singTaskId,
  )
}

// 获取学生
const getData = async () => {
  const { data: stu } = await getSchduleStudent(
    courseId.value as string,
  )
  students.value = stu?.class?.studnets ?? []
  // 学生按照 签到积分排序
  students.value = students.value
    ?.map((s: any) => {
      s.sustain = s.statInfo.reduce(
        (pre, nxt) => {
          if (nxt?.type === null || nxt?.type === undefined) return pre

          if (nxt?.type === 0) return pre +
            (Number.isNaN(Number(nxt?.singTask?.sustain))
              ? 0.5
              : nxt?.singTask?.sustain * 0.5)
          return pre +
            (Number.isNaN(Number(nxt?.singTask?.sustain))
              ? 1
              : nxt?.singTask?.sustain)
        },

        0,
      )
      return s
    })
    .sort((a, b) => b.sustain - a.sustain)
  // console.log(' students.value: ', students.value);
}

watch(
  () => route,
  async nq => {
    if (nq!.name === 'scoursInfo') {
      if (!nq.query?.courseId) {
        close()
        ElMessage.warning('课程id无效')
        return
      }

      if (nq.query?.courseId !== courseId.value) {
        courseId.value = nq.query.courseId as string
        const { data } = await checkCourse(nq.query.courseId as string)

        await nextTick()
        courseInfo.value = data
        radio.value = 0


        await getData()
        activeName.value = 'member'
        activeStudent.value = undefined
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
