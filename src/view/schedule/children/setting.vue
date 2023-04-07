<template>
  <ElScrollbar>
    <div style="background-color: white; height: 100%" class="box-border px-6">

      <div class="text-2xl font-bold p-3">签到设置</div>

      <div class=" relative">
        <div
          class=" z-50 absolute right-3 text-xs top-2 p-2 py-1 bg-purple-700 rounded-md text-white cursor-pointer ring-4 ring-purple-300 select-none"
          :class="[isHistory ? 'ring-yellow-300 bg-yellow-600' : '']" @click="isHistory = !isHistory">{{ isHistory ? '返回' : '历史' }}
        </div>

        <ElTabs type="border-card" v-model="activeName">
          <ElTabPane label="签到管理" name="sing">
            <SingView :is-history="isHistory" />
          </ElTabPane>
          <ElTabPane label="定时任务" name="schedule">
            <ScheduleView :is-history="isHistory" />
          </ElTabPane>

        </ElTabs>

      </div>

      <!-- <p>查看所有的定时任务</p>
    <p>查看所有的单次签到</p>
    <p> 给一个发起签到的入口</p>
    <p>给一个签到中的入口</p> -->
    </div>
  </ElScrollbar>
</template>

<script lang="ts">
export default defineComponent({
  title: '签到设置',
  icon: 'icon-kecheng',
  name: 'scheduleSetting',
})
</script>
<script setup lang="ts">
import SingView from './components/SingView.vue'
import ScheduleView from './components/ScheduleView.vue'


const isHistory = ref<boolean>(false)
const activeName = ref('sing')





</script>

<style scoped lang="scss"></style>
