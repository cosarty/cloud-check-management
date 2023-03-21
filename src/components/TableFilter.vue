<template>
  <div class="flex justify-between">
    <ElForm class="flex-grow">
      <ElRow v-for="idx in rowLen" :key="idx" :gutter="20">
        <ElCol v-for="f in forFilterShow(idx - 1)" :key="f" :span="8">
          <ElFormItem
            :label-width="getField(idx, f).labelWidth ?? '80px'"
            :label="getField(idx, f).label"
          >
            <ElSelect
              v-if="getField(idx, f).type === 'select'"
              :placeholder="getField(idx, f).searcherPlaceHolder"
              v-model="seacherPropsData[getField(idx, f).prop]"
            >
              <ElOption
                v-for="(op, k) in getField(idx, f).options"
                :value="k"
                :label="op"
                :key="k"
              ></ElOption>
            </ElSelect>
            <ElInput
              v-else
              :placeholder="getField(idx, f).searcherPlaceHolder"
              v-model.lazy="seacherPropsData[getField(idx, f).prop]"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <div class="flex justify-end mb-4 ml-2">
      <ElButton @click="reset">重置</ElButton
      ><ElButton type="primary" @click="submit">查询</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableColumType } from './Table.vue'

const props = defineProps<{ filterField: TableColumType }>()

const emit = defineEmits<{ (e: 'change', v: any): void; (e: 'reset'): void }>()

const seacherPropsData = ref<Record<string, any>>({})

const forFilterShow = (idx: number) => {
  const { filterField } = props
  if (filterField.length <= idx * 3 + 3) return filterField.length - idx * 3
  return 3
}

// 一共几行
const rowLen = computed(() => {
  const { filterField } = props
  if (filterField.length <= 3) return 1
  return Math.ceil(filterField.length / 3)
})

const getField = (idx: number, f: number) =>
  props.filterField[(idx - 1) * 3 + f - 1]

const submit = () => {
  emit('change', toRaw(seacherPropsData.value))
}
const reset = () => {
  seacherPropsData.value = {}
  emit('reset')
}
</script>

<style scoped></style>
