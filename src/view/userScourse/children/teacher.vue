<template>
  <div style="background-color: white; height: 100%">
    <div class="text-2xl font-bold p-3">授课班级</div>
    <div v-if="showClassInfo">
      <el-page-header @back="showClassInfo = undefined; isHistory = false" :icon="ArrowLeft" title="返回"
        class="p-4 pb-0 relative">
        <template #content>
          <span class="text-large font-600 mr-3">
            {{ showClassInfo?.className }}
          </span>
        </template>

        <template #extra>
          <div
            class=" z-50 absolute right-6 text-xs top-2 p-2 py-1 bg-purple-700 rounded-md text-white cursor-pointer ring-4 ring-purple-300 select-none"
            :class=" [isHistory ? 'ring-yellow-300 bg-yellow-600' : ''] " @click=" isHistory = !isHistory ">{{ isHistory ?
            '返回' : '历史' }}
          </div>

        </template>
      </el-page-header>
      <el-divider style="margin: 10px 0" />

      <RenderCourse v-if="showClassInfo?.course?.length" :data=" showClassInfo?.course ?? [] " @action=" showScourse "
        :is-history=" isHistory ">

        <template #action=" { co } ">
          <div v-if=" !isHistory " @click.stop=" stopCourse(co) "
            class="absolute h-8 w-20 flex justify-center items-center bottom-0 left-0 text-red-400">
            结课
          </div>
        </template>

        <template #default=" { co } ">
          <div @click.stop=" showKb(co) " class="w-full h-full flex items-center justify-center">
            <el-button type="primary" link>设置课表</el-button>
          </div>
        </template>
      </RenderCourse>
     
    </div>
    <RenderClassList v-else @click=" checkClass " :class-list=" classList " />
    <el-dialog v-model="dialogVisible" title="设置课表" width="70%" destroy-on-close @close=" tagetCourseInfo = undefined ">
      <div class="mb-4 text-lg">
        课程时间：{{
        dayjs(tagetCourseInfo?.ClassSchedule?.starDate).format('YYYY-MM-DD')
        }}
        到
        {{
        dayjs(tagetCourseInfo?.ClassSchedule?.endDate).format('YYYY-MM-DD')
        }}
      </div>
      <Curriculum :schedule=" tagetCourseInfo?.ClassSchedule " :classId=" showClassInfo?.classId " />
    </el-dialog>
  </div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '课程',
  icon: 'icon-shouke',
  name: 'teacherClass',
  auth: 'teacher',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts">

import dayjs from 'dayjs'
import RenderCourse from '@/components/RenderCourse/index.vue'
import { endCourse, getTeacherClass } from '@/http/api'
import RenderClassList from './components/RenderClassList.vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import userStore from '@/store/userStore'
const classList = ref<any>([])
const showClassInfo = ref<any>()
const router = useRouter()
const dialogVisible = ref(false)
const tagetCourseInfo = ref<any>()
const isHistory = ref<boolean>(false)
const user = userStore()
onMounted(() => {
  getTeacherClass({userId:user.userInfo.userId}).then(({ data }) => {
    classList.value = data
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

const checkClass = (data: any) => {
  showClassInfo.value = data
}

const showKb = async (co: any) => {
  await nextTick()
  tagetCourseInfo.value = co
  dialogVisible.value = true
}

const stopCourse = async (c) => {

  const tag = showClassInfo.value.course.find((s: any) => s.ClassSchedule.classScheduleId === c.ClassSchedule.classScheduleId)
  await endCourse(c.ClassSchedule.classScheduleId)
  tag.ClassSchedule.isEnd = true

}

</script>

<style scoped lang="scss"></style>
