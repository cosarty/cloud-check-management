<template>
  <ElForm
    label-width="100"
    class="w-2/6 mt-4"
    :model="updatePasswordForm"
    :rules="rules"
    ref="ruleFormRef"
  >
    <ElFormItem label="旧密码" required prop="oldPassword">
      <ElInput
        type="password"
        placeholder="请输入旧密码"
        v-model="updatePasswordForm.oldPassword"
      />
    </ElFormItem>
    <ElFormItem label="新密码" required prop="newPassword">
      <ElInput
        type="password"
        placeholder="请输入新密码"
        v-model="updatePasswordForm.newPassword"
      />
    </ElFormItem>
    <ElFormItem label="确认密码" required prop="confPassword">
      <ElInput
        type="password"
        placeholder="请确认新密码"
        v-model="updatePasswordForm.confPassword"
      />
    </ElFormItem>
    <ElFormItem label="验证码" required prop="capacha">
      <div class="flex items-center">
        <ElInput
          v-model="updatePasswordForm.capacha"
          autocomplete="on"
          placeholder="请输入验证码"
        />
        <img class="ml-6" @click="resetCode" :src="codeUrl" alt="" />
      </div>
    </ElFormItem>
    <ElFormItem>
      <ElButton :loading="loading" type="primary" @click="submit"
        >确认</ElButton
      >
    </ElFormItem>
  </ElForm>
</template>

<script lang="ts">
export default defineComponent({
  title: '更改密码',
  coverRouter: true,
})
</script>
<script setup lang="ts">
import { updatePassword } from '@/http/api'
import userStore from '@/store/userStore'
import { FormInstance, FormRules } from 'element-plus'
const user = userStore()
const codeUrl = ref(import.meta.env.VITE_APP_API_BASE_URL + '/user/code')
const loading = ref(false)
const updatePasswordForm = ref({
  capacha: '',
  oldPassword: '',
  newPassword: '',
  confPassword: '',
})

const resetCode = () => (codeUrl.value = codeUrl.value + '?' + Math.random())
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  oldPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === updatePasswordForm.value.oldPassword) {
          return callback(new Error('不能设置重复密码'))
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  confPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== updatePasswordForm.value.newPassword) {
          return callback(new Error('密码不一致'))
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  capacha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const submit = async () => {
  const data = await ruleFormRef.value?.validate().catch(() => {})

  if (!data) return

  const { oldPassword, newPassword, capacha } = updatePasswordForm.value
  loading.value = true
  await updatePassword({
    oldPassword,
    newPassword,
    capacha,
    email: user.userInfo.email,
  }).finally(() => {
    loading.value = false
  })
  user.logout(false)
}
</script>

<style scoped></style>
