<template>
  <div>
    <div>
      <slot name="extra" :toggle="toggerVisible"></slot>
    </div>
    <el-dialog v-model="dialogVisible" width="60%" :title="title">
      <el-form label-width="80px" v-if="!isStudent">
        <el-row>
          <el-col :span="10">
            <el-form-item label="搜索地址">
              <el-input
                :prefix-icon="Search"
                type="text"
                v-model="searchAddresKeywords"
                placeholder="请输入地点"
              >
              </el-input>
              <input
                :value="searchAddresKeywords"
                type="text"
                id="searchAddres"
                style="width: 100%; height: 0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="当前地址">
              <ElInput
                placeholder="请输入地址名称"
                v-model="currentLocaltion.address"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isArea">
          <el-col :span="10">
            <el-form-item label="区域名称">
              <ElInput placeholder="请输入区域名称" v-model="areaName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isScope">
          <el-col :span="10">
            <el-form-item label="范围">
              <ElInputNumber
                placeholder="请输入范围"
                v-model.lazy="scopeName"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-else>
        <div class="my-3 text-lg font-bold">{{ tiptext }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="confirmSelect"
            :disabled="isStudent && singDistance >= (scopeName ?? 0)"
            >确 定</el-button
          >
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </template>
      <div class="map-container">
        <el-icon
          class="refresh-icon"
          size="25"
          style="cursor: pointer"
          @click="() => reloadLocaltion()"
        >
          <Refresh />
        </el-icon>
        <BdMap :id="id" :loading="mapLoading"></BdMap>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import BdMap from './BdMap.vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import useMap from '@/hooks/userMap/index'

const searchAddresKeywords = ref('')
const dialogVisible = ref(false)
const areaName = ref('')
const scopeName = ref<number>()

const signLocation = ref<any>({})

const defCon = () => ({ city: '', district: '', province: '', lat: 0, lng: 0 })
const props = defineProps<{
  title: string
  id: string
  isArea?: boolean
  isScope?: boolean
  isStudent?: boolean
}>()
const emit = defineEmits<{ (e: 'confirm', data: any): void }>()
const {
  loadCurrentLocal,
  mapLoading,
  LocalSearch,
  circleOverlay,
  getDistance,
} = useMap(
  props.id,
  async ({ info, getpo }: any) => {
    // 如果是学生禁止搜索
    if (props.isStudent) return

    currentLocaltion.value = { areaId: currentLocaltion.value.areaId }
    currentLocaltion.value.address = info.province + info.keyword
    currentLocaltion.value.lng = getpo.lng
    currentLocaltion.value.lat = getpo.lat
    searchAddresKeywords.value = ''

    await circleOverlay(scopeName.value ?? 0, getpo.lng, getpo.lat)
  },
  props.isStudent ?? false,
)
const currentLocaltion = ref<
  | {
      city?: string
      district?: string
      province?: string
      lat?: number
      lng?: number
    }
  | any
>(defCon())

const singDistance = computed(() => {
  const s = scopeName.value ?? 0

  if (signLocation.value.distance <= s) return signLocation.value.distance
  return (signLocation.value.distance ?? 0) - s ?? 0
})

const tiptext = computed(() =>
  singDistance.value < (scopeName.value ?? 0)
    ? '当前在签到范围内'
    : `当前距离签到位置:${singDistance.value} 米`,
)

const toggerVisible = () => (dialogVisible.value = !dialogVisible.value)

// 加载当前地址
const reloadLocaltion = async (lng?: number, lat?: number) => {
  let res: any
  if (lng && lat) {
    await loadCurrentLocal(lng, lat)

    // 如果是学生禁止
    if (props.isStudent) return
    await circleOverlay(scopeName.value ?? 0, lng, lat)
  } else {
    res = await loadCurrentLocal()
    // 如果是学生的话就显示老师画的范围就好
    if (props.isStudent) {
      const { lat, lng } = currentLocaltion.value
      // 记录签到地址
      signLocation.value = { lat, lng }
      // 获取距离
      const distance = getDistance(signLocation.value, res.point)
      signLocation.value.distance = Math.round(distance)
      await circleOverlay(scopeName.value ?? 0, lng, lat)
    }
    let addressInfo = res.addressComponents
    currentLocaltion.value.lng = res.point.lng
    currentLocaltion.value.lat = res.point.lat
    currentLocaltion.value.address =
      addressInfo.province +
      addressInfo.city +
      addressInfo.district +
      addressInfo.street +
      addressInfo.streetNumber +
      res.business

    // 如果是学生禁止
    if (props.isStudent) {
      return
    }
    await circleOverlay(
      scopeName.value ?? 0,
      currentLocaltion.value.lng,
      currentLocaltion.value.lat,
    )
  }

  LocalSearch()
}

watch(dialogVisible, async vi => {
  if (vi) {
    const { lat, lng } = currentLocaltion.value
    if (lat && lng && !props.isStudent) {
      await reloadLocaltion(lng, lat)
      return
    }

    await reloadLocaltion()
  } else {
    currentLocaltion.value = {}
    searchAddresKeywords.value = ''
    areaName.value = ''
    scopeName.value = undefined
    signLocation.value = {}
  }
})

watch(scopeName, async () => {
  // 如果是学生禁止
  if (props.isStudent) return
  await circleOverlay(
    scopeName.value ?? 0,
    currentLocaltion.value.lng,
    currentLocaltion.value.lat,
  )
})
const updateData = (data: any) => {
  currentLocaltion.value = data
  areaName.value = data.areaName
  scopeName.value = data.distance
  toggerVisible()
}
const confirmSelect = () => {
  const { province, city, district, address, lat, lng, areaId } =
    currentLocaltion.value

  let text: any
  if (currentLocaltion.value.city)
    text = (province ?? '') + (city ?? '') + (district ?? '') + address
  else text = (province ?? '') + address
  if ((!lat || !lng) && !props.isStudent) {
    ElMessage.warning('请选择地址！！！')
    return
  }

  if (props.isArea && !areaName.value && !props.isStudent) {
    ElMessage.warning('请输入区域名称')
    return
  }

  // 如果是学生就计算距离
  if (props.isStudent) {
    // 距离不足就提示
  }

  emit('confirm', {
    locationName: text,
    location: { lng, lat },
    areaName: areaName.value,
    areaId,
    distance: scopeName.value,
  })

  dialogVisible.value = false
}

defineExpose({ updateData })
</script>

<style scoped lang="scss">
.map-container {
  height: 600px;
  position: relative;
}

.refresh-icon {
  position: absolute;
  z-index: 9999;
  right: 15px;
  top: 10px;
}
</style>
