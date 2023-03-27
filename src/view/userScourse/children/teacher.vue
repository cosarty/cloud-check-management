<template>
  <div style="background-color: white; height: 100%">
    <div v-if="showClassInfo">
      <el-page-header
        @back="showClassInfo = undefined"
        :icon="ArrowLeft"
        title="返回"
        class="p-4 pb-0"
      >
        <template #content>
          <span class="text-large font-600 mr-3">
            {{ showClassInfo?.className }}
          </span>
        </template>
      </el-page-header>
      <el-divider style="margin: 10px 0" />

      <RenderCourse :data="showClassInfo?.course ?? []" @action="showScourse">
        <template #default="{ co }">
          <el-button
            type="primary"
            @click.stop=";(dialogVisible = true), (tagetCourseInfo = co)"
            link
            >设置课表</el-button
          ></template
        >
      </RenderCourse>
    </div>
    <RenderClassList v-else @click="checkClass" :class-list="classList" />
    <el-dialog
      v-model="dialogVisible"
      title="设置课表"
      width="70%"
      destroy-on-close
      @close="tagetCourseInfo = undefined"
    >
      <div class="mb-4 text-lg">
        课程时间：{{
          dayjs(tagetCourseInfo?.ClassSchedule?.starDate).format('YYYY-MM-DD')
        }}
        到
        {{
          dayjs(tagetCourseInfo?.ClassSchedule?.endDate).format('YYYY-MM-DD')
        }}
      </div>
      <Curriculum />
    </el-dialog>
  </div>
</template>

<!-- 辅导员 -->
<script lang="ts">
export default defineComponent({
  title: '课程',
  icon: 'icon-xuesheng',
  name: 'teacherClass',
  auth: 'teacher',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts">
import dayjs from 'dayjs'
import RenderCourse from '@/components/RenderCourse/index.vue'
import { getTeacherClass } from '@/http/api'
import RenderClassList from './components/RenderClassList.vue'
import { ArrowLeft } from '@element-plus/icons-vue'
const classList = ref<any>([])
const showClassInfo = ref<any>()
const router = useRouter()
const dialogVisible = ref(false)
const tagetCourseInfo = ref<any>()

onMounted(() => {
  getTeacherClass().then(({ data }) => {
    classList.value = data
  })
})
const showScourse = (comd: string, data: any) => {
  if (comd === 'show') {
    router.push({ name: 'scoursInfo', query: { courseId: data.courseId } })
  }
}

const checkClass = (data: any) => {
  showClassInfo.value = data
}
</script>

<style scoped lang="scss"></style>
