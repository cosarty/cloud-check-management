<template>
  <div @click="dialogVisible = true">
    <slot></slot>
  </div>
  <MapPopUp ref="mapRef" title="选择位置" id="allmap" @confirm="add" is-scope>
    <template #extra="{ toggle }">
      <el-dialog
        v-model="dialogVisible"
        title="设置"
        width="40%"
        destroy-on-close
      >
        <el-form label-width="90px" class="w-2/3 mx-auto">
          <el-form-item label="任务名称" required>
            <el-input v-model="info.taskName" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="check" label="立即签到" size="large" />
          </el-form-item>
          <el-form-item v-if="!check" label="签到时间" required>
            <el-date-picker
              v-model="info.taskTime"
              type="datetime"
              placeholder="请选择签到时间"
            />
          </el-form-item>
          <el-form-item label="课程" required>
            <el-select
              v-model="info.classScheduleId"
              placeholder="请选择课程"
              required
            >
              <el-option
                :label="data.courseName + '(' + data.className + ')'"
                :value="data.classScheduleId"
                v-for="(data, idx) in option"
                :key="idx"
              >
                <span style="float: left">{{ data.courseName }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ data.className }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签到分数" required>
            <ElInputNumber :min="1" v-model="info.sustain" />
          </el-form-item>
          <el-form-item label="持续时间" required>
            <ElInputNumber :min="1" v-model="info.integral"></ElInputNumber>
          </el-form-item>
          <el-form-item label="选择地址">
            <el-radio-group v-model="info.isCustom" class="ml-4">
              <el-radio :label="false" size="large">选择区域</el-radio>
              <el-radio :label="true" size="large">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="!info.isCustom">
            <el-form-item label="区域">
              <el-select v-model="info.areaId" placeholder="请选择区域">
                <el-option
                  :label="data.label"
                  :value="data.areaId"
                  v-for="(data, idx) in araeOption"
                  :key="idx"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="范围">
              <ElInputNumber v-model="info.distance" :min="1" /> (米)
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item required>
              <ElButton @click="selectLocation(toggle)" link type="primary"
                >选择地址</ElButton
              >
            </el-form-item>
            <el-form-item
              label="位置名称"
              required
              v-if="info.locationName !== undefined"
            >
              <ElInput v-model="info.locationName" />
            </el-form-item>
            <el-form-item label="范围">
              <ElInputNumber v-model="info.distance" :min="1" /> (米)
            </el-form-item>
          </template>
          <el-form-item label="开启人脸">
            <ElSwitch v-model="info.isFace" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </MapPopUp>
</template>

<script setup lang="ts">
import { getAreaList, getClassChedule } from '@/http/api'
import { createSingTask, updateSingTask } from '@/http/api/singTask'

const emit = defineEmits<{ (e: 'submit'): void }>()

const mapRef = ref<any>()
const dialogVisible = ref(false)
// 判断是否立即签到
const check = ref(true)
const info = ref<any>({ isCustom: false })

const option = ref<any[]>([])
const araeOption = ref<any[]>([])

const submit = async () => {
  if (info.value.singTaskId) {
    await updateSingTask({ ...info.value, isCurrent: check.value })
  } else {
    await createSingTask({ ...info.value, isCurrent: check.value })
  }

  dialogVisible.value = false

  emit('submit')
}

watch(dialogVisible, nv => {
  if (!nv) {
    info.value = { isCustom: false }
    check.value = true
    option.value = []
    araeOption.value = []
  } else {
    getCourse()
    getArea()
  }
})

const getCourse = async () => {
  const { data } = await getClassChedule()
  option.value = data.map(({ classScheduleId, class: cl, course }: any) => ({
    classScheduleId,
    className: cl.className,
    courseName: course.courseName,
  }))
}

const selectLocation = (toggle: any) => {
  const { locationName, location } = info.value
  if (!locationName || !location) {
    toggle()
    return
  }
  mapRef.value.updateData({
    ...info.value,
    ...JSON.parse(info.value.location),
    address: info.value.locationName,
  })
}

const getArea = async () => {
  // araeOption
  const {
    data: { rows },
  } = await getAreaList()
  araeOption.value = rows.map((r: any) => ({
    areaId: r.areaId,
    label: r.areaName,
  }))
}

const add = async (data: any) => {
  delete data.areaId
  data.location = JSON.stringify(data.location)
  Object.assign(info.value, data)
}

// 更新数据
const updateInfo = (data: any) => {
  check.value = false
  info.value = data
  if (info.areaId) {
    info.value.isCustom = false
  } else {
    info.value.isCustom = true
  }
  dialogVisible.value = true

  console.log('data: ', data)
}

watch(
  () => info.value.isCustom,
  nv => {
    if (nv) {
      info.value.areaId = undefined
    } else {
      ;(info.value.location = undefined), (info.value.locationName = undefined)
    }
  },
)

defineExpose({
  updateInfo,
})
</script>

<style scoped lang="scss"></style>
