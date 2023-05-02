<template>
  <div class="continer">
    <div class="flex stat-item" v-for="{ account, userName, userId, pic, statInfo } in data" :key="userId">
      <ElAvatar :size="40" :src="pic ??
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        " />

      <div class="text-xs ml-2">
        <div>{{ userName }}</div>
        <div class="text-gray-700 mt-1">
          {{ account }}
        </div>
      </div>
      <div class=" ml-auto">
        <ElButton type="primary" link v-if="action !== 1" @click="$emit('click', 1, userId, statInfo[0]?.statId)"> 已签到
        </ElButton>
        <ElButton type="primary" link v-if="action !== 0" @click="$emit('click', 0, userId, statInfo[0]?.statId)"> 迟到
        </ElButton>
        <ElButton type="primary" link v-if="action !== 2" @click="$emit('click', 2, userId, statInfo[0]?.statId)"> 未签到
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
defineProps<{ data: any; action: Number }>()
defineEmits<{ (e: 'click', action: number, userId: any, statId: any): void }>()


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
