<template>
  <slot :updateVisBale="updateVisBale"></slot>

  <el-dialog
    v-model="dialogVisible"
    title="下发课程"
    width="30%"
    destroy-on-close
  >
    <ElForm
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="max-w-md"
      label-width="100px"
    >
      <ElFormItem label="班级" prop="classId">
        <ElSelect
          :disabled="readonly"
          v-model="ruleForm.classId"
          class="w-full"
          placeholder="选择班级"
        >
          <ElOption
            :label="op.className"
            :value="op.classId"
            v-for="op in options"
            :key="op.classId"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="备注" prop="comment">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="到"
          start-placeholder="请选择上课时间"
          end-placeholder="请选择结课时间"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { getClassList } from '@/http/api'
import type { FormInstance, FormRules } from 'element-plus'
import userStore from '@/store/userStore'
const user = userStore()
const value1 = ref('')

watch(value1, () => {
  console.log(value1.value)
})
const courseId = ref<string>()
const dialogVisible = ref(false)
const options = ref<any>([])
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<any>({})
const readonly = ref(false)
const rules = reactive<FormRules>({
  courseName: [{ required: true, message: '请输入课程名', trigger: 'blur' }],
})
const submitForm = async () => {
  if (!ruleFormRef.value) return
  if (readonly.value) {
    dialogVisible.value = false
    return
  }
  const valid = await ruleFormRef.value.validate().catch(() => {})
  //   register
  if (!valid) return

  if (!courseId.value) {
    return
  }
  console.log('下发')

  //   emit('reset')
  //   dialogVisible.value = false
}

const updateVisBale = () => (dialogVisible.value = !dialogVisible.value)

const updateData = (data: any) => {
  if (!data) return
  updateVisBale()
  courseId.value = data
}

watch(dialogVisible, async vi => {
  if (!vi) {
    ruleForm.value = {}
    courseId.value = undefined
  } else {
    if (user.userInfo.departmentId) {
      const { data } = await getClassList({
        departmentId: user.userInfo.departmentId,
      })
      options.value = data.rows
    }
  }
})

defineExpose({
  updateData,
})
</script>
<style scoped></style>
