<template>
  <slot :updateVisBale="updateVisBale"></slot>

  <el-dialog
    v-model="dialogVisible"
    title="添加学生"
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
      <ElFormItem>
        <ElUpload
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :headers="{ Authorization: `Bearer ${user.token}` }"
          :action="actionUrl"
          name="userAvatarDir"
        >
          <ElAvatar
            :size="100"
            :src="
              ruleForm.pic ??
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
            shape="square"
          />
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="学号" required prop="account">
        <ElInput v-model.number="ruleForm.account" placeholder="请输入学号" />
      </ElFormItem>
      <ElFormItem label="姓名" required prop="userName">
        <ElInput v-model="ruleForm.userName" placeholder="请输入名字" />
      </ElFormItem>
      <ElFormItem label="邮箱" required prop="email">
        <ElInput v-model="ruleForm.email" placeholder="请输入邮箱" />
      </ElFormItem>
      <ElFormItem label="班级" prop="classId">
        <ElSelect
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
      <ElFormItem label="性别" prop="sex">
        <ElRadioGroup class="ml-3" v-model="ruleForm.sex">
          <ElRadio :label="0">女</ElRadio>
          <ElRadio :label="1">男</ElRadio>
        </ElRadioGroup>
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
import {
  getTeacher,
  createClass,
  updateClass,
  getClassList,
  register,
} from '@/http/api'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import userStore from '@/store/userStore'

const actionUrl =
  import.meta.env.VITE_APP_API_BASE_URL + '/upload/userAvatarDir'

const user = userStore()
const porps = defineProps<{
  departmentId?: string
  code?: number
  className?: string
  teacherId?: string
  remarks?: string
}>()
const dialogVisible = ref(false)
const options = ref<any>([])

const emit = defineEmits<{ (e: 'reset'): void }>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<any>({})

const rules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  account: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
})
const submitForm = async () => {
  if (!ruleFormRef.value) return

  const valid = await ruleFormRef.value.validate().catch(() => {})
  //   register
  if (!valid) return

  await register({ ...ruleForm.value, auth: 'student' })
  //   if (ruleForm.value?.classId) {
  //     await updateClass({
  //       ...ruleForm.value,
  //       ...(ruleForm.value.picture
  //         ? { picture: ruleForm.value.picture.split('/').pop() }
  //         : {}),
  //     })
  //   } else {
  //     await createClass({
  //       ...ruleForm.value,
  //       ...(ruleForm.value.picture
  //         ? { picture: ruleForm.value.picture.split('/').pop() }
  //         : {}),
  //     })
  //   }

  emit('reset')
  dialogVisible.value = false
}

const updateVisBale = () => (dialogVisible.value = !dialogVisible.value)

const updateData = (data: any) => {
  updateVisBale()
  nextTick().then(() => {
    Object.assign(
      ruleForm.value,
      [...Object.keys(data)]
        .filter(k => data[k])
        .reduce((p, k) => Object.assign(p, { [k]: data[k] }), {}),
    )
  })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handleAvatarSuccess = async (response: any, uploadFile: any) => {
  ElMessage.success(response.message)
  ruleForm.value.pic = response.data
}

watch(dialogVisible, async vi => {
  if (vi) {
    const { data } = await getClassList()
    options.value = data.rows
  } else {
    ruleForm.value = {}
  }
})

defineExpose({
  updateData,
})
</script>
<style scoped></style>
