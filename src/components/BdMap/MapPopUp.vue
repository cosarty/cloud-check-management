<template>
  <div>
    <div><slot name="extra" :toggle="toggerVisible"></slot></div>
    <el-dialog v-model="dialogVisible" width="60%" :title="title">
      <el-form label-width="80px">
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
              <el-input
                placeholder="请输入内容"
                v-model="currentLocaltion.address"
                readonly
              >
                <template #prepend>
                  <div v-if="currentLocaltion.city">
                    {{ currentLocaltion.province }}{{ currentLocaltion.city
                    }}{{ currentLocaltion.district }}
                  </div>
                  <div v-else>
                    {{ currentLocaltion.province }}
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </template>
      <div class="map-container">
        <el-icon
          class="refresh-icon"
          size="25"
          style="cursor: pointer"
          @click="reloadLocaltion"
          ><Refresh
        /></el-icon>
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

const defCon = () => ({ city: '', district: '', province: '', lat: 0, lng: 0 })
const props = defineProps<{ title: string; id: string }>()
const emit = defineEmits<{ (e: 'confirm', data: any): void }>()
const { loadCurrentLocal, mapLoading, LocalSearch } = useMap(
  props.id,
  ({ info, getpo }: any) => {
    currentLocaltion.value = {}
    currentLocaltion.value.province = info.province
    currentLocaltion.value.address = info.keyword
    currentLocaltion.value.lng = getpo.lng
    currentLocaltion.value.lat = getpo.lat
  },
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

const toggerVisible = () => (dialogVisible.value = !dialogVisible.value)

// 加载当前地址
const reloadLocaltion = async () => {
  const res = await loadCurrentLocal()
  LocalSearch()

  let addressInfo = res.addressComponents
  currentLocaltion.value.lng = res.point.lng
  currentLocaltion.value.lat = res.point.lat
  currentLocaltion.value.province = addressInfo.province
  currentLocaltion.value.city = addressInfo.city
  currentLocaltion.value.district = addressInfo.district

  currentLocaltion.value.address =
    addressInfo.street + addressInfo.streetNumber + res.business
}

watch(dialogVisible, async vi => {
  if (vi) {
    await reloadLocaltion()
  } else {
    currentLocaltion.value = {}
  }
})

const confirmSelect = () => {
  const { province, city, district, address, lat, lng } = currentLocaltion.value
  let text: any
  if (currentLocaltion.value.city) text = province + city + district + address
  else text = province + address
  if (!lat || !lng) {
    ElMessage.warning('请选择地址！！！')
  }
  dialogVisible.value = false
  emit('confirm', { text, point: { lng, lat } })
}
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
