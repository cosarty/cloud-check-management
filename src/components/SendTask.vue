<template>
  <div @click="dialogVisible = true">
    <slot></slot>
  </div>
  <MapPopUp ref="mapRef" title="选择位置" id="allmap" @confirm="add" is-scope>
    <template #extra="{ toggle }">

      <el-dialog v-model="dialogVisible" title="设置" width="40%">
        <el-form label-width="90px" class=" w-2/3 mx-auto">
          <el-form-item label="任务名称">
            <el-input v-model="info.taskName" />
          </el-form-item>
          <el-form-item label="签到时间">
            <el-input v-model="info.taskTime" />
          </el-form-item>
          <el-form-item label="课程">
            <el-select v-model="info.classScheduleId" placeholder="请选择课程">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="签到分数">
            <ElInputNumber v-model="info.sustain" />
          </el-form-item>
          <el-form-item label="持续时间">
            <ElInputNumber v-model="info.integral"></ElInputNumber>
          </el-form-item>
          <el-form-item label="选择地址">
            <el-radio-group v-model="info.isCustom" class="ml-4">
              <el-radio :label="false" size="large">选择区域</el-radio>
              <el-radio :label="true" size="large">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="!info.isCustom" label="区域">
            <el-select v-model="info.areaId" placeholder="请选择区域">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!info.isCustom" label="范围">
            <ElInputNumber v-model="info.distance" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit(toggle)">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>


    </template>
  </MapPopUp>
</template>

<script setup lang="ts">
/* 
 元素：
  
签到时间
签到位置
选择区域
签到分数
签到的持续时间

*/
const mapRef = ref<any>()
const dialogVisible = ref(false)

const info = ref<any>({isCustom:false})


const submit = (toggle: any) => {
  dialogVisible.value = false
  if (info.value.isCustom) {
    toggle()  
  }
  
}

watch(dialogVisible, (nv) => {
  if (!nv) {
    info.value = {isCustom:false}
  }
})

const add = async (data: any) => {
  data.location = JSON.stringify(data.location)
  info.value = data
  dialogVisible.value = true

}
</script>

<style scoped lang="scss"></style>