<template>
  <div class="course-box flex flex-wrap" :class="{ 'pointer-events-none': !!isHistory }">

    <div v-if="list?.length" @click="$emit('action', 'show', co)" v-for="co in list" :key="co.courseId"
      class="flex-shrink-0 course-item shadow-xl flex flex-col group rounded-xl overflow-hidden relative basis-1/6 hover:text-emerald-600"
      :class="{ disable: !!isHistory }" style="box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12)">
      <ElImage class="h-36 w-full object-cover shadow-sm" :src="co.picture ?? emtyCourse" :class="{ fix: co.picture }">
      </ElImage>
      <div class="p-5">
        <div class="pb-2 font-bold text-lg">{{ co.courseName }}</div>
        <div class="pb-2 text-sm text-gray-400">
          {{ co.comment ?? '暂无备注' }}
        </div>
        <div class="text-sm" :class="{ 'mb-2': showTime }">
          指导教师: {{ co.user?.userName ?? ' 未知' }}
        </div>
        <!-- <div class="text-xs pb-2">
          班级: <span class="text-amber-600 align-middle">计算机一班</span>
        </div> -->
        <div class="text-xs text-slate-600" v-if="showTime">
          创建时间:
          <span class="text-amber-600 align-middle">{{
            dayjs(co.createdAt).format('YYYY-MM-DD')
          }}</span>
        </div>
        <div class="text-xs text-slate-600 my-3 mb-5" v-if="co.ClassSchedule">
          授课时间:
          <span class="text-amber-600 align-middle">
            {{ dayjs(co.ClassSchedule.starDate).format('YYYY-MM-DD') }} /
            {{ dayjs(co.ClassSchedule.endDate).format('YYYY-MM-DD') }}</span>
        </div>
      </div>

      <div
        class="hidden absolute group-hover:block items-center right-0 bg-orange-300 rounded-bl-xl bg-opacity-90 text-amber-700"
        v-if="isAction">
        <span class="inline-block p-2 px-4 text-xs" @click="$emit('action', 'update', co)">编辑</span>
        <span class="inline-block border-l-2 border-orange-400 p-2 px-4 text-xs"
          @click="$emit('action', 'delete', co)">删除</span>
      </div>

      <div
        class="hidden absolute p-1 px-4 group-hover:block items-center bottom-0 right-0 bg-cyan-200 rounded-tl-xl text-cyan-500"
        v-if="isAction" @click.stop="$emit('action', 'issued', co)">下发</div>

      <slot :co="co" name="action"></slot>
      <div class="absolute h-8 w-20 flex justify-center items-center bottom-0 right-3 bg-cyan-200" v-if="$slots.default">
        <slot :co="co"></slot>
      </div>
    </div>

    <div v-else class="text-cyan-700 mt-6 text-lg font-bold flex flex-col items-center mx-auto">

      <ElImage :src="emptyCourse" class="my-4"></ElImage>
      暂无课程
    </div>
  </div>

  <div class="flex justify-end my-4 mr-10">
    <el-pagination v-model:current-page="currentPage" background layout="prev, pager, next" hide-on-single-page
      :page-size="pageSize" :total="data.length" />
  </div>
</template>

<script setup lang="ts">

import dayjs from 'dayjs'
import emptyCourse from '@/assets/course-empty.png'
const currentPage = ref<number>(1)

const props = withDefaults(
  defineProps<{
    data: any
    isAction?: boolean
    pageSize?: number
    showTime?: boolean
    isHistory?: boolean
  }>(),
  {
    pageSize: 10,
    showTime: false,
    isHistory: false,
  },
)

defineEmits<{
  (e: 'action', comd: 'update' | 'delete' | 'issued' | 'show', data: any): void
}>()
const list = computed(() => {

  if (props.data.length <= props.pageSize) return props.data.filter((d: any) => (!!d?.ClassSchedule?.isEnd) === props?.isHistory)

  return props.data
    .filter((d: any) => !!d?.ClassSchedule?.isEnd === props.isHistory)
    .slice(
      props.pageSize * (currentPage.value - 1),
      props.pageSize * currentPage.value,
    )
})

watch(
  () => props.data,
  np => {

    currentPage.value = 1
  },
  {
    deep: true,
  },
)
watch(
  () => props.isHistory,
  np => {
    currentPage.value = 1
  },
)
</script>

<style scoped lang="scss">
.course-box {
  .course-item {
    cursor: pointer;
    margin: 1rem;
    position: relative;

    &.disable::before {
      z-index: 9999;
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-image: url('@/assets/stale_dated.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 50% 30%;
      backdrop-filter: grayscale(0.95);
    }
  }

  :deep(.el-image) {
    vertical-align: middle;

    &.fix {
      img {
        object-fit: cover;
      }
    }

    img {
      object-fit: contain;

      object-position: top;
      transition: 300ms ease-in-out;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
