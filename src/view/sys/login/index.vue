<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-icon-img">
        <img src="@/assets/mange-icon.png" />
        <p class="login-title">智能点名后端管理系统</p>
      </div>
      <div class="login-form">
        <h2 class="login-form__title">登录</h2>
        <ElForm @submit.prevent :model="loginForm" :rules="rules"  ref="ruleFormRef">
          <ElSpace :size="10" fill class="fill">
            <ElFormItem prop="userName">
              <ElInput v-model="loginForm.userName" placeholder="请输入邮箱或者账号" autocomplete="off" />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput type="password" placeholder="请输入密码" autocomplete="off" v-model="loginForm.password" />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({
  userName: '',
  password: '',
  remember: false,
})

const rules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
})

const submit = async () => {
 if(!ruleFormRef) return 
  await ruleFormRef.value?.validate((valid, fields) => {
    console.log('valid, fields: ', valid, fields);
    
  })

}
</script>

<style scoped lang="scss">
@use 'index' as *;
</style>
