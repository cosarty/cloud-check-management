<template>
  <slot :updateVisBale="updateVisBale"></slot>

  <el-dialog
    v-model="dialogVisible"
    :title="coTitle"
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
          :data="{ flag: 'update' }"
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
      <ElFormItem label="教师编号" required prop="account">
        <ElInput
          v-model.number="ruleForm.account"
          placeholder="请输入教师编号"
        />
      </ElFormItem>
      <ElFormItem label="姓名" required prop="userName">
        <ElInput v-model="ruleForm.userName" placeholder="请输入名字" />
      </ElFormItem>
      <ElFormItem label="邮箱" required prop="email">
        <ElInput v-model="ruleForm.email" placeholder="请输入邮箱" />
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
import { getClassList, register, updateOtherUser } from '@/http/api'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import userStore from '@/store/userStore'
import { title } from 'process'

const actionUrl =
  import.meta.env.VITE_APP_API_BASE_URL + '/upload/userAvatarDir'

const user = userStore()
const porps = defineProps<{
  title: string
}>()
const dialogVisible = ref(false)

const coTitle = ref(porps.title)

const emit = defineEmits<{ (e: 'reset'): void }>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<any>({})
const readonly = ref(false)
const rules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  account: [{ required: true, message: '请输入教师编号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
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

  if (!ruleForm.value.userId) {
    await register({
      ...ruleForm.value,
      auth: 'teacher',
      ...(ruleForm.value.pic
        ? { pic: ruleForm.value.pic.split('/').pop() }
        : {}),
    })
  } else {
    await updateOtherUser({
      ...ruleForm.value,
      ...(ruleForm.value.pic
        ? { pic: ruleForm.value.pic.split('/').pop() }
        : {}),
    })
  }

  emit('reset')
  dialogVisible.value = false
}

const updateVisBale = () => (dialogVisible.value = !dialogVisible.value)

const updateData = (data: any, title?: string, isReadonly?: boolean) => {
  updateVisBale()
  if (title) coTitle.value = title
  if (isReadonly) readonly.value = isReadonly
  nextTick().then(() => {
    Object.assign(
      ruleForm.value,
      [...Object.keys(data)]
        .filter(k => data[k] === 0 || data[k])
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
  if (!vi) {
    ruleForm.value = {}
    coTitle.value = porps.title
    readonly.value = false
  }
})

defineExpose({
  updateData,
})
</script>
<style scoped></style>
