
<template>
  <div style="background-color: white; height: 100%" class=" box-border">
    <ElScrollbar>
      <div class="text-2xl font-bold p-3">管理班级</div>
      <div v-if="showClassInfo">
        <el-page-header @back="showClassInfo = undefined; activeName = 'first'" :icon="ArrowLeft" title="返回"
          class="p-4 pb-0">
          <template #content>
            <span class="text-large font-600 mr-3">
              {{ showClassInfo?.className }}
            </span>
          </template>
        </el-page-header>
        <el-divider style="margin: 10px 0" />
        <div class=" px-10 ">


          <el-tabs v-model=" activeName " style="height: 90%;">
            <el-tab-pane label="统计" name="first">

              <ClassStatInfo :class-id=" showClassInfo.classId "></ClassStatInfo>

            </el-tab-pane>
            <el-tab-pane label="课表" name="second">

              <Tmetable :class-id=" showClassInfo.classId "></Tmetable>

            </el-tab-pane>

          </el-tabs>


        </div>
      </div>
      <RenderClassList v-else @click=" checkClass " :class-list=" classList " :hide-course=" true " />
    </ElScrollbar>

  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '班级',
  icon: 'icon-kecheng',
  name: 'instructor',
  auth: ['instructor'],
  orderNo: 15,
})
</script>
<script setup lang="ts">
import { getInstructor } from '@/http/api'
import { ArrowLeft } from '@element-plus/icons-vue'
import RenderClassList from '@/view/userScourse/children/components/RenderClassList.vue'
import ClassStatInfo from '@/components/ClassStatInfo.vue'
import Tmetable from '@/components/Tmetable.vue'
const showClassInfo = ref<any>()
const classList = ref<any>([])
const activeName = ref('first')

onMounted(async () => {
  const { data } = await getInstructor()

  classList.value = data

})

const checkClass = (data: any) => {
  showClassInfo.value = data

}

</script>

<style scoped lang="scss"></style>
