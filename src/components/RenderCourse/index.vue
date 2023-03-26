<template>
  <div class="course-box flex flex-wrap">
    <div
      v-for="co in data"
      :key="co.courseId"
      class="flex-shrink-0 course-item shadow-xl flex flex-col group rounded-xl overflow-hidden relative basis-1/6"
      style="box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12)"
    >
      <ElImage
        class="h-36 w-full object-cover shadow-sm"
        :src="co.picture ?? emtyCourse"
        :class="{ fix: co.picture }"
      ></ElImage>
      <div class="p-5">
        <div class="pb-2 font-bold text-lg">{{ co.courseName }}</div>
        <div class="pb-2 text-sm text-gray-400">
          {{ co.comment ?? '暂无备注' }}
        </div>
        <div class="text-sm pb-2">{{ co.user.userName }}</div>
        <div class="text-xs pb-2">
          班级: <span class="text-amber-600 align-middle">计算机一班</span>
        </div>
        <div class="text-xs text-slate-600" v-if="showTime">
          创建时间:
          <span class="text-amber-600 align-middle">{{
            dayjs(co.createdAt).format('YYYY-mm-DD')
          }}</span>
        </div>
      </div>

      <div
        class="hidden absolute group-hover:block items-center right-0 bg-orange-300 rounded-bl-xl bg-opacity-90 text-amber-700"
        v-if="isAction"
      >
        <span
          class="inline-block p-2 px-4 text-xs"
          @click="$emit('action', 'update', co)"
          >编辑</span
        >
        <span
          class="inline-block border-l-2 border-orange-400 p-2 px-4 text-xs"
          @click="$emit('action', 'delete', co)"
          >删除</span
        >
      </div>

      <div
        class="hidden absolute p-1 px-4 group-hover:block items-center bottom-0 right-0 bg-cyan-200 rounded-tl-xl text-cyan-500"
        v-if="isAction"
      >
        下发
      </div>
    </div>
  </div>

  <div class="flex justify-end">
    <el-pagination
      v-model:current-page="currentPage"
      background
      layout="prev, pager, next"
      hide-on-single-page
      :page-size="pageSize"
      :total="data.length"
    />
  </div>
</template>

<script setup lang="ts">
import emtyCourse from '@/assets/emty-course.png'
import dayjs from 'dayjs'
const currentPage = ref<number>(1)

const props = withDefaults(
  defineProps<{
    data: any
    isAction?: boolean
    pageSize: number
    showTime?: boolean
  }>(),
  {
    pageSize: 12,
    showTime: false,
  },
)
const list = ref<any>(props.data)
defineEmits<{
  (e: 'action', comd: 'update' | 'delete' | 'issued', data: any): void
}>()

watch(
  currentPage,
  np => {
    if (list.value.length <= props.pageSize * currentPage.value) return

    list.value = props.data.slice(
      props.pageSize * (currentPage.value - 1),
      props.pageSize * currentPage.value,
    )
  },
  {
    immediate: true,
    deep: true,
  },
)

watch(
  () => props.data,
  np => {
    list.value = np
    currentPage.value = 1
  },
  {
    deep: true,
  },
)
</script>

<style scoped lang="scss">
.course-box {
  .course-item {
    cursor: pointer;
    margin: 1rem;
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
