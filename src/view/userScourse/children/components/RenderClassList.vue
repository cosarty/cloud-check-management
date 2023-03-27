<template>
  <div class="course-box flex">
    <div
      @click="$emit('click', cl)"
      v-for="cl in classList"
      :key="cl.classId"
      class="flex flex-col m-6 w-1/6 cursor-pointer"
      style="box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2)"
    >
      <ElImage
        class="h-64 object-contain object-center w-full"
        :src="cl.picture ?? classEmptyIcon"
      />
      <div class="relative h-36 pt-14">
        <div>
          <ElAvatar
            :size="60"
            :src="cl?.teacher?.pic ?? avatarDefault"
            class="absolute -top-0 -translate-y-1/2 left-4"
          />
          <div class="ml-20 -mt-10 text-xs text-slate-500">
            {{ cl?.teacher?.userName ?? '暂无辅导员' }}
          </div>
        </div>
        <div class="text-lg ml-4 mb-2">{{ cl.className }}</div>
        <div class="ml-4 text-sm text-slate-500 mb-2">{{ cl.remarks }}</div>
        <div class="ml-4 text-xs">
          授课门数：{{ cl.course?.length ?? 0 }} 门
        </div>
        <div class="text-xs text-cyan-800 text-right mr-3 mt-2">
          进入<el-icon class="align-middle"><ArrowRightBold /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import classEmptyIcon from '@/assets/class-empty.png'
import avatarDefault from '@/assets/avatar-default.png'
import { ArrowRightBold } from '@element-plus/icons-vue'
defineProps<{ classList?: any }>()
defineEmits<{ (e: 'click', data: any): void }>()
</script>

<style scoped lang="scss">
.course-box {
  .course-item {
    cursor: pointer;
    margin: 1rem;
  }
  :deep(.el-image) {
    vertical-align: middle;

    img {
      object-fit: cover;
      object-position: top;
      transition: 300ms ease-in-out;
    }
  }
}
</style>
