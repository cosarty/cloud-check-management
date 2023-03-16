<template>
  <el-button type="primary" :icon="Plus" @click="dialogVisible = true">
    添加系别
  </el-button>

  <el-dialog v-model="dialogVisible" title="添加系" width="30%">
    <ElForm
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="max-w-md"
      label-width="100px"
    >
      <ElFormItem label="系名" required prop="departmentName">
        <ElInput v-model="ruleForm.departmentName" placeholder="请输入系名" />
      </ElFormItem>
      <ElFormItem label="辅导员" prop="userId">
        <ElSelect
          v-model="ruleForm.userId"
          class="w-full"
          placeholder="选择辅导员"
        >
          <ElOption
            :label="op.userName"
            :value="op.userId"
            v-for="op in options"
            :key="op.userId"
          />
        </ElSelect>
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
import { Plus } from '@element-plus/icons-vue'
import { getTeacher } from '@/http/api'
import type { FormInstance, FormRules } from 'element-plus'
import { createDepartment } from '@/http/api/department'
const dialogVisible = ref(false)
const options = ref<{ userName: string; userId: string }[]>([])

const emit = defineEmits<{ (e: 'reset'): void }>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({})

const rules = reactive<FormRules>({
  departmentName: [{ required: true, message: '请输入系名', trigger: 'blur' }],
})
const submitForm = async () => {
  if (!ruleFormRef.value) return
  const valid = await ruleFormRef.value.validate().catch(() => {})
  if (!valid) return

  await createDepartment(ruleForm.value)
  emit('reset')
  dialogVisible.value = false
}
watch(dialogVisible, async vi => {
  if (!vi) ruleForm.value = {}
  else {
    const { data } = await getTeacher()
    options.value = data
  }
})
</script>
<style scoped></style>
