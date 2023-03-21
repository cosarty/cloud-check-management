<template>
  <slot :updateVisBale="updateVisBale"></slot>

  <el-dialog
    v-model="dialogVisible"
    title="添加班级"
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
      <ElFormItem label="班级编号" required prop="code">
        <ElInput v-model.number="ruleForm.code" placeholder="请输入班级编号" />
      </ElFormItem>
      <ElFormItem label="班级名字" required prop="className">
        <ElInput v-model="ruleForm.className" placeholder="请输入班级名字" />
      </ElFormItem>
      <ElFormItem label="系别" required prop="departmentId">
        <ElSelect
          v-model="ruleForm.departmentId"
          class="w-full"
          placeholder="请选择系别"
        >
          <ElOption
            :label="op.departmentName"
            :value="op.departmentId"
            v-for="op in departList"
            :key="op.departmentId"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="辅导员" prop="teacherId">
        <ElSelect
          v-model="ruleForm.teacherId"
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
      <ElFormItem label="备注" prop="remarks">
        <ElInput v-model="ruleForm.remarks" placeholder="请输入备注" />
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
import { getTeacher, createClass, updateClass } from '@/http/api'
import type { FormInstance, FormRules } from 'element-plus'

const porps = defineProps<{
  departmentId?: string
  departList: any[]
  code?: number
  className?: string
  teacherId?: string
  remarks?: string
}>()
const dialogVisible = ref(false)
const options = ref<{ userName: string; userId: string }[]>([])

const emit = defineEmits<{ (e: 'reset'): void }>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<any>({})

const rules = reactive<FormRules>({
  className: [{ required: true, message: '请输入班级名', trigger: 'blur' }],
  code: [{ required: true, message: '请输入班级编号', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择系别', trigger: 'blur' }],
})
const submitForm = async () => {
  if (!ruleFormRef.value) return

  const valid = await ruleFormRef.value.validate().catch(() => {})

  if (!valid) return
  if (ruleForm.value?.classId) {
    await updateClass(ruleForm.value)
  } else {
    await createClass(ruleForm.value)
  }

  emit('reset')
  dialogVisible.value = false
}

const updateVisBale = () => (dialogVisible.value = !dialogVisible.value)

const updateData = (data: any) => {
  updateVisBale()

  Object.assign(
    ruleForm.value,
    [...Object.keys(data)]
      .filter(k => data[k])
      .reduce((p, k) => Object.assign(p, { [k]: data[k] }), {}),
  )
}

watch(dialogVisible, async vi => {
  const { departmentId } = porps
  if (vi && departmentId) ruleForm.value = { departmentId }
  if (!vi) ruleForm.value = {}
  else {
    const { data } = await getTeacher()
    options.value = data
  }
})

defineExpose({
  updateData,
})
</script>
<style scoped></style>
