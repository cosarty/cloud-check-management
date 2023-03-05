<template>
  <div class="login-container">
    <div class="login-content">
      <Transition appear name="login">
        <div class="login-icon-img" style="--offset-x:-100px">
          <img src="@/assets/mange-icon.png" />
          <p class="login-title">智能点名后端管理系统</p>
        </div>
      </Transition>
      <Transition appear name="login" style="--offset-x:100px">
        <div class="login-form">
          <h2 class="login-form__title">登录</h2>
          <ElForm @submit.prevent :model="loginForm" :rules="rules" ref="ruleFormRef">
            <ElSpace :size="10" fill class="fill">
              <ElFormItem prop="email">
                <ElInput v-model="loginForm.email" placeholder="请输入邮箱" />
              </ElFormItem>
              <ElFormItem prop="password">
                <ElInput type="password" placeholder="请输入密码" v-model="loginForm.password" />
              </ElFormItem>
            </ElSpace>
            <ElSpace :size="10" fill class="fill">
              <ElRow justify="space-between">
                <ElCol :span="5">
                  <ElFormItem prop="remember">
                    <ElCheckbox label="记住我" v-model="loginForm.remember"></ElCheckbox>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="5.5">
                  <ElButton link type="primary">忘记密码</ElButton>
                </ElCol>
              </ElRow>
              <ElFormItem>
                <ElButton type="primary" :size="'large'" class="fill" @click="submit">登录</ElButton>
              </ElFormItem>
            </ElSpace>
          </ElForm>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { login } from '@/http/api/user'
import { omit } from '@/utils/object'
import userStore from '@/store/userStore';
type FormType = {
  email: string,
  password: string,
  remember: boolean,
}
const ruleFormRef = ref<FormInstance>()
const loginForm = reactive<FormType>({
  email: '',
  password: '',
  remember: false,
})

const rules = reactive<FormRules>({
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
  {
    type: 'email',
    message: '请输入合法邮箱',
    trigger: ['blur'],
  }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
})

const user = userStore()
const submit = async () => {
  if (!ruleFormRef) return
  const v = await ruleFormRef.value?.validate()
  if (!v) return
  await user.login(omit(loginForm, ['remember']))
}
</script>

<style scoped lang="scss">
@use 'index' as *;
</style>
