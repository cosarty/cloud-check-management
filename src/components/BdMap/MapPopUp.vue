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
              >
                <template #prepend>
                  {{ currentLocaltion.province }}{{ currentLocaltion.city
                  }}{{ currentLocaltion.district }}
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
        <BdMap :id="id" :loading="mapLoading"></BdMap>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import BdMap from './BdMap.vue'
import { Search } from '@element-plus/icons-vue'
import useMap from '@/hooks/userMap/index'

const searchAddresKeywords = ref('')
const dialogVisible = ref(false)

const defCon = () => ({ city: '', district: '', province: '', lat: 0, lng: 0 })
const props = defineProps<{ title: string; id: string }>()
const { loadCurrentLocal, mapLoading, LocalSearch } = useMap(props.id)
const currentLocaltion = reactive<
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

watch(dialogVisible, async vi => {
  if (vi) {
    const res = await loadCurrentLocal()
    LocalSearch()
    console.log('res: ', res)
    var addressInfo = res.addressComponents
    currentLocaltion.longitude = res.point.lng
    currentLocaltion.latitude = res.point.lat
    currentLocaltion.province = addressInfo.province
    currentLocaltion.city = addressInfo.city
    currentLocaltion.district = addressInfo.district

    currentLocaltion.address =
      addressInfo.street + addressInfo.streetNumber + res.business
  }
})

const confirmSelect = () => {}
</script>

<style scoped lang="scss">
.map-container {
  height: 600px;
}
</style>
