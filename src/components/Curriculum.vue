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
        class="bg-slate-300 flex items-center justify-center border-r-2 border-fuchsia-600"
        ><div>{{ startTime ?? '未知' }} - {{ endTime ?? '未知' }}</div></el-col
      >
      <el-col
        @click="checkTime(k, id)"
        :span="3"
        v-for="k in weekKey"
        :key="k"
        class="truncate overflow-ellipsis flex items-center justify-center bg-sky-200 cursor-pointer hover:bg-sky-600 border-t-2 border-r-2 border-fuchsia-600"
        :class="{ 'border-b-2': id === 11 }"
      >
        11111111111111111111111111111111111111111111111111111111111111111111111
      </el-col>
    </el-row>
    <el-dialog
      v-model="innerVisible"
      width="30%"
      :title="WeekNum[selectKey!]"
      append-to-body
      align-center
      @close="
        ;(formSelect = defaultConf()),
          (selectCount = 1),
          (selectKey = undefined)
      "
    >
      <div>
        <div v-for="count in selectCount" :key="new Date().getTime() * count">
          <div class="flex items-center">
            <div>（{{ count }}）</div>
            <el-select
              v-model="formSelect[count].id"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in 11"
                :key="item"
                :label="'第' + item + '节课'"
                :value="item"
                :disabled="
                  [...Object.values(formSelect)].some(f => f.id === item)
                "
              /> </el-select
            ><el-icon
              v-if="selectCount < 11"
              :size="20"
              class="cursor-pointer"
              @click="selectCount < 11 && selectCount++"
              ><CirclePlus
            /></el-icon>
            <el-icon
              v-if="selectCount > 1"
              :size="20"
              class="cursor-pointer"
              @click="selectCount > 1 && (formSelect[selectCount--] = {})"
              ><CircleClose
            /></el-icon>
          </div>

          <div class="border-2 border-red-500 w-max px-4 mb-6">
            <div class="my-3">
              上课前
              <el-input-number
                v-model="formSelect[count].time"
                :min="1"
                :max="10"
              />
              分钟自动发起签到
            </div>
            <div>
              <span>是否开启定时功能</span>
              <el-switch
                v-model="formSelect[count].sw"
                class="ml-2"
                style="--el-switch-on-color: #13ce66"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button>Cancel</el-button>
          <el-button type="primary"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { WeekNum } from '@/enum/weekEnum'
import { getTime } from '@/http/api'
import { CirclePlus, CircleClose } from '@element-plus/icons-vue'
export type SchoolTimeType = Record<keyof typeof WeekNum, string[]>
const selectKey = ref<keyof typeof WeekNum>()
const defaultConf = () => ({
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

const selectCount = ref(1)
const formSelect = ref<any>(defaultConf())
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

const checkTime = (k: keyof typeof WeekNum, id: any) => {
  innerVisible.value = true
  selectKey.value = k
  formSelect.value[1] = { id }
}
</script>

<style scoped lang="scss"></style>
