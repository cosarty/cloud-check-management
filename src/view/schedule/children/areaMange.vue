<template>
  <div style="background-color: white; height: 100%" class="flex flex-col">
    <div class="p-3 py-6 pr-16 flex justify-between">
      <div class="text-2xl font-bold">区域设置</div>
      <MapPopUp
        ref="mapRef"
        title="选择位置"
        id="allmap"
        @confirm="add"
        is-area
      >
        <template #extra="{ toggle }">
          <el-button @click="toggle" :icon="Plus" type="primary">
            添加区域
          </el-button>
        </template>
      </MapPopUp>
    </div>

    <div class="bg-slate-300 flex-grow pt-6">
      <Table
        :colums="areaColum"
        :action="areaAtion"
        :request="request"
        ref="tableRef"
      >
        <template #lng="{ row }">
          {{ JSON.parse(row.location)['lng'] }}
        </template>
        <template #lat="{ row }">
          {{ JSON.parse(row.location)['lat'] }}
        </template>
      </Table>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '区域管理',
  icon: 'icon-kecheng',
  name: 'areaMange',
})
</script>
<script setup lang="ts">
import MapPopUp from '@/components/BdMap/MapPopUp.vue'
import { Plus } from '@element-plus/icons-vue'

import { TableColumType, TableActionType } from '@/components/Table.vue'
import { createArea, delArea, getAreaList, updateArea } from '@/http/api'
// var a = ['114.066392,22.748699', '114.07991,22.640074']

const mapRef = ref<any>()
const tableRef = ref<any>()
const areaColum: TableColumType = [
  {
    prop: 'areaName',
    label: '区域名称',
  },
  {
    prop: 'lng',
    label: '经度',
  },

  {
    prop: 'lat',
    label: '纬度',
  },

  {
    prop: 'locationName',
    label: '位置',
    width: '400px',
  },
  {
    prop: 'createdAt',
    type: 'date',
    label: '创建时间',
  },
]

const areaAtion: TableActionType = [
  {
    type: 'primary',
    title: '编辑',
    link: false,
    async event(data: any) {
      mapRef.value.updateData({
        ...data,
        ...JSON.parse(data.location),
        address: data.locationName,
      })
    },
  },
  {
    type: 'danger',
    title: '删除',
    confirmTitle: '确认删除',
    link: true,
    async event(row: any) {
      await delArea(row.areaId)
      tableRef.value.reset()
    },
  },
]

const request = async (pram: any) => {
  const {
    data: { count, rows },
  } = await getAreaList({ ...pram })

  return [rows ?? [], count ?? 0]
}
const add = async (data: any) => {
  data.location = JSON.stringify(data.location)
  if (data.areaId) {
    await updateArea({ ...data })
  } else {
    await createArea({ ...data })
  }
  tableRef.value.reset()
}
</script>

<style scoped lang="scss"></style>
