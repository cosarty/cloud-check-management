<template>
  <div class="h-full flex-grow flex bg-white">
    <div v-if="!userId" class=" basis-80 shrink-0 overflow-hidden border-solid border-r-2 border-neutral-500">
      <ElScrollbar>
        <div>
          <div class="p-2 flex items-center border-b-2 cursor-pointer" :class="{
              'bg-amber-200': activeStudent === ot.userId,
              'bg-slate-100': activeStudent !== ot.userId,
            }" v-for="(ot, index) in students" :key="ot.userId" @click="checkUser(ot.userId)">
            <span class="w-5 h-5 rounded-full text-sm text-center mr-2 bg-red-300 text-white">{{
              index + 1
            }}</span>
            <ElAvatar :size="40" :src="ot?.pic ??
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                " />
            <div class="text-xs ml-2">
              <div>{{ ot?.userName }}</div>
              <div class="text-gray-700 mt-1">{{ ot?.account }}</div>
            </div>
            <div class="text-xs ml-auto flex items-center">
              经验值:<span class="ml-1 text-lg text-orange-500">{{
                ot?.sustain
              }}</span>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <div class="flex-grow bg-white">

      <ElScrollbar>
        <!-- <Statistics :class-schedule-id="courseId" :user-id="activeStudentInfo?.userId"></Statistics> -->
        <ClassDiagram :user-id="activeStudent ?? userId" :class-id="classId"></ClassDiagram>

      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUsersClass } from '@/http/api';
import ClassDiagram from './ClassDiagram.vue'

const props = defineProps<{ classId: string, userId?: string }>()
const activeStudent = ref<any>(undefined)
const students = ref<any>({})
const getStudent = async () => {
  const {
    data: { count, rows },
  } = await getUsersClass(props.classId, {})
  // console.log('rows: ', rows);
  students.value = rows
    ?.map((s: any) => {
      s.sustain = s.statInfo.reduce(
        (pre: any, nxt: any) => {
          if (nxt?.type === null || nxt?.type === undefined) return pre

          if (nxt?.type === 0) return pre +
            ((Number.isNaN(Number(nxt?.singTask?.sustain))
              ? 0.5
              : nxt?.singTask?.sustain * 0.5))
          return pre +
            ((Number.isNaN(Number(nxt?.singTask?.sustain))
              ? 1
              : nxt?.singTask?.sustain))
        },

        0,
      )
      return s
    })
    .sort((a, b) => b.sustain - a.sustain)
}

const checkUser = (userId: any) => {
  if (activeStudent.value === userId) {
    activeStudent.value = undefined
  } else {
    activeStudent.value = userId
  }
}

onMounted(() => {
  getStudent()
})

</script>

<style lang="scss" scoped></style>