<template>
  <div class="continer">
    <div class="flex stat-item" v-for="{ singTaskId, taskName, sustain, students } in data" :key="singTaskId">
      <div class="basis-40">{{ taskName }}</div>
      <div class="flex-grow">{{ sustain }}经验</div>
      <div class="flex-grow" v-if="students[0]">
        {{ dayjs(students[0].statTime).format('YYYY-MM-DD HH:mm:ss') }}
      </div>
      <div v-if="!isStudent">
        <ElButton type="primary" link v-if="action !== 1" @click="$emit('click', 1, students[0]?.statId, singTaskId)"> 已签到
        </ElButton>
        <ElButton type="primary" link v-if="action !== 0" @click="$emit('click', 0, students[0]?.statId, singTaskId)"> 迟到
        </ElButton>
        <ElButton type="primary" link v-if="action !== 2" @click="$emit('click', 2, students[0]?.statId, singTaskId)"> 未签到
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
defineProps<{ data: any; isStudent: boolean; action: Number }>()
defineEmits<{ (e: 'click', action: number, statInfo: any, singTaskId: any): void }>()

/**
 * 已签到
 * 1.迟到
 * 2. 未签到
 *
 *
 * 迟到
 * 签到
 * 未签到
 *
 * 未签到
 *
 * 迟到
 * 已签到
 */
</script>

<style scoped lang="scss">
.continer {
  .stat-item {
    border-bottom: 1px solid rgba($color: #d0a3a3, $alpha: 0.4);
    padding-bottom: 15px;

    &:first-of-type~.stat-item {
      margin-top: 15px;
    }
  }
}
</style>
