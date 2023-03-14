<template>
  <div class="count-box mt-4">
    <div class="mb-4">
      <ElUpload
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :headers="{ Authorization: `Bearer ${user.token}` }"
        action="http://localhost:3030/api/upload/userAvatarDir"
        name="userAvatarDir"
      >
        <ElAvatar
          :size="100"
          :src="
            user.userInfo.pic ??
            'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          "
          shape="square"
        />
      </ElUpload>
    </div>
    <ElForm>
      <ElFormItem label="姓名：">
        <ElInput
          :model-value="user.userInfo.userName"
          placeholder="请输入姓名"
          readonly
        />
      </ElFormItem>
      <ElFormItem label="学号：">
        <ElInput
          :model-value="user.userInfo.account"
          placeholder="请输入学号"
          readonly
        />
      </ElFormItem>
      <ElFormItem label="性别：">
        <ElRadioGroup
          class="ml-3"
          :model-value="user.userInfo.sex"
          @change="changeSex"
        >
          <ElRadio :label="0">女</ElRadio>
          <ElRadio :label="1">男</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="班级：">
        <ElInput
          :model-value="user.userInfo.class?.className"
          placeholder="请选择班级"
          readonly
        />
      </ElFormItem>
      <ElFormItem label="系别：">
        <ElInput
          :model-value="user.userInfo.class?.departmentId ?? '未知'"
          placeholder="请选择系别"
          readonly
        />
      </ElFormItem>
      <ElFormItem label="邮箱：">
        <div class="flex items-center">
          <ElInput
            :model-value="user.userInfo.email"
            placeholder="请输入邮箱"
            readonly
          /><ElIcon :size="20" class="cursor-pointer" @click="emailShow = true">
            <Edit
          /></ElIcon>
        </div>
      </ElFormItem>
    </ElForm>

    <ElDialog
      destroy-on-close
      v-model="emailShow"
      title="修改邮箱"
      :show-close="false"
      align-center
      class="max-w-2xl"
      @close="countForm = {}"
    >
      <ElForm
        class="w-4/6 mx-auto"
        :model="countForm"
        :rules="rules"
        ref="ruleFormRef"
      >
        <ElFormItem prop="email">
          <ElInput
            v-model="countForm.email"
            :size="'large'"
            placeholder="请输入邮箱"
          >
            <template #prefix>
              <el-icon size="25"><Message /></el-icon>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem prop="captcha">
          <div class="flex item-center w-full">
            <ElInput
              :size="'large'"
              v-model="countForm.captcha"
              placeholder="请输入验证码"
            >
              <template #prefix>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yanzhengma"></use>
                </svg>
              </template>
            </ElInput>
            <ElButton class="ml-4" type="primary" round>发送验证码</ElButton>
          </div>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="emailShow = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="submit">
            确认
          </el-button>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '基本资料',
})
</script>

<script setup lang="ts">
import { updateUser } from '@/http/api'
import userStore from '@/store/userStore'
import { Edit, Message } from '@element-plus/icons-vue'
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus'

const ruleFormRef = ref<FormInstance>()
const countForm = ref<{ email?: string; captcha?: string }>({})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入合法邮箱',
      trigger: ['blur'],
    },
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
})

const loading = ref(false)
const user = userStore()
const emailShow = ref(false)
// 更新性别
const changeSex = async (e: any) => {
  await updateUser({ sex: e })
  await user.getUserInfo()
}

const handleAvatarSuccess = async (response: any, uploadFile: any) => {
  ElMessage.success(response.message)
  await user.getUserInfo()
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

const submit = async () => {
  const data = await ruleFormRef.value?.validate().catch(() => {})
  if (!data) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emailShow.value = false
  }, 2000)
}
</script>

<style scoped lang="scss">
.count-box {
  padding-left: 2rem;

  @include useIcon(1.5rem);
}
</style>
