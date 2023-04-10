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
      <ElButton class="ml-auto mr-6 -mt-16" type="primary" v-if="!isStudent"
        >发起签到</ElButton
      >
    </div>
    <div class="px-64 -mt-16">
      <el-tabs v-model="activeName">
        <el-tab-pane label="成员" name="member"></el-tab-pane>
        <el-tab-pane label="活动" name="schdule"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="h-4 bg-red-200 flex-grow flex" v-if="activeName === 'member'">
      <div class="basis-64 bg-orange-300 shrink-0 overflow-hidden">
        <ElScrollbar>
          <div>
            <div
              class="p-3 bg-amber-500 flex items-center border-b-2 cursor-pointer"
            >
              <ElAvatar
                :size="50"
                :src="
                  myInfo?.pic ??
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              />

              <div class="text-sm ml-2">
                <div>{{ myInfo?.userName }}</div>
                <div class="text-gray-700 mt-1">{{ myInfo?.account }}</div>
              </div>
            </div>
            <div
              class="p-3 flex items-center border-b-2 cursor-pointer"
              v-for="ot in otherInfo"
              :key="ot.userId"
            >
              <ElAvatar
                :size="50"
                :src="
                  ot?.pic ??
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              />
              <div class="text-sm ml-2">
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
      class="h-4 bg-red-200 flex-grow flex flex-col"
      v-if="activeName === 'schdule'"
    >
      <div class="m-4 -mb-1 my-2">
        <el-radio-group v-model="radio" class="ml-3">
          <el-radio :label="0" size="large">进行中</el-radio>
          <el-radio :label="1" size="large">已结束</el-radio>
        </el-radio-group>
      </div>
      <div class="m-4 flex-1 bg-white rounded-lg">
        {{ schduleInfo[0].locationName }}
      </div>
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
// import closeCurrentTab from '@/hooks/closeCurrentTab'
import { checkCourse, getSchduleStudent } from '@/http/api'
import { createSingTask, getCurrentTask } from '@/http/api/singTask'
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

const schduleInfo = ref<any>([])

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

const submit = () => {
  createSingTask({ classScheduleId: courseId.value })
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

        const { data: scd } = await getCurrentTask({
          classScheduleId: nq.query.courseId,
        })
        await nextTick()
        courseInfo.value = data
        radio.value = 0
        students.value = stu?.class?.studnets ?? []
        activeName.value = 'member'

        schduleInfo.value = scd.rows
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
