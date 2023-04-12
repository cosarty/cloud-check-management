<template>
  <div
    style="background-color: white; height: 100%"
    class="box-border max-w-6xl mx-auto flex flex-col"
  >
    <!-- <ElButton @click="submit">发起签到</ElButton> -->
    <div class="flex items-center p-5 pl-24 bg-slate-300">
      <ElImage
        class="h-36 w-36 rounded-full border-orange-600 border-2 object-cover shadow-sm"
        :src="courseInfo?.course?.picture ?? emtyCourse"
        :class="{ fix: courseInfo?.course?.picture }"
      >
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
        <SendTask
          v-if="!isStudent"
          ref="sendTaskRef"
          @submit="submit"
          :class-schedule-id="courseId"
        >
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
      <div
        class="basis-64 shrink-0 overflow-hidden border-solid border-r-2 border-neutral-500"
      >
        <ElScrollbar>
          <div>
            <div
              v-if="myInfo"
              class="p-2 bg-amber-500 flex items-center border-b-2 cursor-pointer"
            >
              <ElAvatar
                :size="40"
                :src="
                  myInfo?.pic ??
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              />

              <div class="text-xs ml-2">
                <div>{{ myInfo?.userName }}</div>
                <div class="text-gray-700 mt-1">{{ myInfo?.account }}</div>
              </div>
            </div>
            <div
              class="p-2 flex items-center border-b-2 cursor-pointer bg-slate-100"
              v-for="ot in otherInfo"
              :key="ot.userId"
            >
              <ElAvatar
                :size="40"
                :src="
                  ot?.pic ??
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              />
              <div class="text-xs ml-2">
                <div>{{ ot?.userName }}</div>
                <div class="text-gray-700 mt-1">{{ ot?.account }}</div>
              </div>
            </div>
          </div>
        </ElScrollbar>
      </div>
      <div class="flex flex-col flex-grow">
        <div class="basis-20 bg-lime-100">fsfds</div>
      </div>
    </div>

    <div
      class="h-4 mt-3 flex-grow flex flex-col"
      v-if="activeName === 'schdule'"
    >
      <ElScrollbar>
        <div class="m-4 my-2">
          <el-radio-group v-model="radio" class="ml-3" @change="radioChange">
            <el-radio :label="0" size="large">进行中</el-radio>
            <el-radio :label="1" size="large">已结束</el-radio>
          </el-radio-group>
        </div>
        <div class="m-4 flex-1 bg-white rounded-lg">
          <!-- {{ singTaskinfo }} -->
          <div
            v-for="info in singTaskinfo"
            :key="info.singTaskId"
            class="flex mb-4 rounded-lg bg-blue-100 p-1 h-20 items-center max-w-3xl mx-auto"
          >
            <ElImage :src="qiandao" class="w-12 h-12" />
            <div class="flex-grow flex flex-col pl-3 py-2 h-full">
              <div class="text-lg pb-2 flex items-center">
                <span class="mr-3"> {{ info.taskName }}</span>
                <el-tag type="danger" v-if="info.isEnd">已结束</el-tag>
                <el-tag type="success" v-else-if="!info.isEnd && info.isRun"
                  >签到中</el-tag
                >
                <el-tag type="warning" v-else-if="!info.isEnd && !info.isRun"
                  >等待签到</el-tag
                >
              </div>
              <div class="text-xs divide-x divide-yellow-600 divide-solid">
                <span class="px-2 pl-0"
                  >共{{ info.students?.length }}人参与</span
                ><span class="px-2">{{
                  dayjs(info.taskTime).format('YYYY-MM-DD')
                }}</span
                ><span class="px-2">积分:{{ info.sustain }}</span
                ><span class="px-2">持续时间:{{ info.integral }}</span>
              </div>
            </div>

            <ElButton
              link
              type="primary"
              class="mr-3"
              v-if="!info.isEnd && info.isRun && isStudent"
              @click="statClick(info)"
              >签到</ElButton
            >
            <ElButton
              link
              type="primary"
              class="mr-3"
              v-if="!info.isEnd && info.isRun && !isStudent"
              >查看</ElButton
            >
          </div>

          <div v-if="!singTaskinfo?.length" class="  text-cyan-700 text-lg font-bold flex flex-col items-center">
            <ElImage :src="emptySchdule" class=" my-4"></ElImage>
            暂无活动</div>
        </div>
      </ElScrollbar>
    </div>
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
import { checkCourse, getSchduleStudent } from '@/http/api'
import {
  createSingTask,
  getCurrentTask,
  getSingTask,
} from '@/http/api/singTask'
import userStore from '@/store/userStore'
import emtyCourse from '@/assets/emty-course.png'

/**
 * 1. 判断时学生还是老师
 * 2. 学生的话只能查看 自己的数据
 * 3. 老师的话可以创建和查看
 */

const radio = ref(0)

const user = userStore()

const activeName = ref('member')

const singTaskinfo = ref<any>([])
// const close = closeCurrentTab()
const route = useRoute()
const courseId = ref<string>('')
const courseInfo = ref<any>({})
const students = ref<any>([])
const isStudent = computed(() => user.userInfo.auth?.includes('student'))

// 我的数据
const myInfo = computed(() => {
  return isStudent
    ? students.value?.filter(
        (s: any) => s?.userId === user?.userInfo?.userId,
      )?.[0]
    : null
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


const statClick = (info:any) => {
 console.log( dayjs(info.taskTime).add(info.integral,'second').isAfter(dayjs()))
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
        const { data: stu } = await getSchduleStudent(
          nq.query.courseId as string,
        )

        await nextTick()
        courseInfo.value = data
        radio.value = 0
        students.value = stu?.class?.studnets ?? []
        activeName.value = 'member'
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
