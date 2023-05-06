<template>
  <ElScrollbar v-loading="loading">
    <div class="grid md:grid-cols-4 gap-3 ">
      <el-card shadow="hover" :body-style="{ padding: '20px' }" v-for="(card, index) of cards" :key="index"
        class="cursor-pointer">
        <template #header>
          <div class="flex justify-between items-center">
            {{ card.title }}
            <el-tag type="danger" size="small" effect="dark">总</el-tag>
          </div>
        </template>

        <section class="flex mt-3 justify-between items-center">
          <span class="text-3xl">{{ card.total }}</span>
          <i :class="[card.icon, card.iconColor]" class="text-5xl"></i>
        </section>

      </el-card>
    </div>


    <div class=" bg-white" v-if="user.userInfo.classId">

      <ClassDiagram :class-id="user.userInfo.classId" :user-id="user.userInfo.userId"></ClassDiagram>
    </div>
  </ElScrollbar>
</template>
<script lang="ts">
export default defineComponent({
  auth: 'student',
  hideMenu: true,
  coverRouter: true,
})
</script>
<script setup lang="ts">
import { getStudentHome } from '@/http/api';
import ClassDiagram from '@/components/ClassDiagram.vue';
import userStore from '@/store/userStore';
const homeInfo = ref<any>({})

const user = userStore()
const loading = ref(false)
const cards = computed(() => [
  {
    title: '总签到数',
    total: homeInfo.value.singPass ?? 0,
    iconColor: 'text-violet-500',
    icon: 'fas fa-address-card',

  },
  {
    title: '迟到数',
    total: homeInfo.value.singLate ?? 0,
    iconColor: 'text-green-600',
    icon: 'fas fa-apple-alt',

  },
  {
    title: '缺勤数',
    total: homeInfo.value.singDuty ?? 0,
    iconColor: 'text-blue-500',
    icon: 'fas fa-award',

  },
  {
    title: '课程数',
    total: homeInfo.value.schduleNum ?? 0,
    iconColor: 'text-blue-500',
    icon: 'fas fa-award',

  }
])


onMounted(async () => {
  loading.value = true
  const { data } = await getStudentHome()
  console.log('data: ', data);

  homeInfo.value = data
  loading.value = false
})
</script>

<style lang="scss" scoped></style>
