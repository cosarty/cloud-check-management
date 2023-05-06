
<template>
  <div style="background-color: white; height: 100%" class="box-border">

    <div class=" h-16 flex items-center pl-4 bg-orange-200">班级: {{ classInfo.className }}</div>
    <div class=" h-5/6  px-7 mx-auto mt-4 box-border  ">
      <Tmetable :class-id="classId"></Tmetable>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '课表',
  icon: 'icon-kebiao',
  name: 'courseTmetable',
  auth: ['student'],
  orderNo: 15,
})
</script>
<script setup lang="ts">
import Tmetable from '@/components/Tmetable.vue';
import userStore from '@/store/userStore';

const user = userStore()

const classId = computed(() => user.userInfo.classId)
const classInfo = computed(() => user.userInfo.class)
</script>

<style scoped lang="scss"></style>
