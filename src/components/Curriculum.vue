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
      class="h-12 border-orange-500 border-solid"
    >
      <el-col
        :span="3"
        class="bg-slate-300 flex items-center justify-center border-r-2 border-fuchsia-600"
        ><div>{{ startTime ?? '未知' }} - {{ endTime ?? '未知' }}</div></el-col
      >
      <el-col
        @click="checkTime"
        :span="3"
        v-for="k in weekKey"
        :key="k"
        class="flex items-center justify-center bg-sky-200 cursor-pointer hover:bg-sky-600 border-t-2 border-r-2 border-fuchsia-600"
        :class="{ 'border-b-2': id === 11 }"
      ></el-col>
    </el-row>
    <el-dialog
      v-model="innerVisible"
      width="30%"
      title="选择时间"
      append-to-body
      align-center
    />
  </div>
</template>

<script setup lang="ts">
import { WeekNum } from '@/enum/weekEnum'
import { getTime } from '@/http/api'

const timeList = ref<any>([])
const innerVisible = ref(false)
onMounted(() => {
  getTime().then(({ data }) => {
    console.log('res: ', data)
    timeList.value = data
  })
})

const weekKey = computed(
  () => [...Object.keys(WeekNum)] as (keyof typeof WeekNum)[],
)

const checkTime = () => {
  innerVisible.value = true
}
</script>

<style scoped lang="scss"></style>
