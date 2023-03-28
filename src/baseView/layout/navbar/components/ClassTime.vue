<template>
  <ElDrawer v-model="drawer" :with-header="false" append-to-body size="27%">
    <div class="mb-3 font-bold text-lg">上课时间</div>
    <div>
      <div v-for="jo in defaultJoint" :key="jo" class="mb-3">
        <div class="mb-3">第 {{ jo }} 节课</div>
        <div v-if="user.auth.includes('super')">
          <el-time-select
            :clearable="false"
            v-model="timeList[jo].startTime"
            :max-time="timeList[jo].endTime"
            class="mr-1"
            placeholder="Start time"
            start="08:00"
            step="00:05"
            end="21:30"
            @change="timeChange"
          />
          <el-time-select
            :clearable="false"
            v-model="timeList[jo].endTime"
            :min-time="timeList[jo].startTime"
            placeholder="End time"
            start="08:00"
            step="00:05"
            end="21:30"
            @change="timeChange"
          />
        </div>
        <div v-else class="bg-lime-200 p-2 text-sm">
          {{ timeList[jo].startTime ?? '未知' }} -
          {{ timeList[jo].endTime ?? '未知' }}
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { getTime, updateTime } from '@/http/api'
import userStore from '@/store/userStore'
const user = userStore()
const drawer = ref(false)
const defaultJoint = 11
const timeList = ref<any>({
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  11: {},
})

defineExpose({
  updateDrawer: () => (drawer.value = !drawer.value),
})

onMounted(async () => {
  const { data } = await getTime()
  for (const { id, startTime, endTime } of data) {
    timeList.value[id] = {
      startTime,
      endTime,
    }
  }
})

const timeChange = async () => {
  await updateTime(Object.values(timeList.value))
}
</script>

<style scoped>
.el-drawer__header {
  margin-bottom: 0 !important;
}
</style>
