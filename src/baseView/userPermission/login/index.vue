<template>
  <div class="login-container">
    <div class="login-content">
      <Transition appear name="login">
        <div class="login-icon-img" style="--offset-x: -100px">
          <img src="@/assets/mange-icon.png" />
          <p class="login-title">智能点名后端管理系统</p>
        </div>
      </Transition>
      <Transition appear name="login">
        <div class="login-form" style="--offset-x: 100px">
          <h2 class="login-form__title text-3xl font-bold mb-4">{{ isForget ? '忘记密码' : '登录' }}</h2>
          <ElForm v-if="!isForget" @submit.prevent :model="loginForm" :rules="rules" ref="ruleFormRef">
            <ElSpace :size="10" fill class="fill">
              <ElFormItem prop="email">
                <ElInput v-model="loginForm.email" placeholder="请输入邮箱" />
              </ElFormItem>
              <ElFormItem prop="password">
                <ElInput type="password" placeholder="请输入密码" v-model="loginForm.password" />
              </ElFormItem>
            </ElSpace>
            <ElSpace :size="10" fill class="fill">
              <ElRow justify="end">
                <!-- <ElCol :span="5">
                  <ElFormItem prop="remember">
                    <ElCheckbox
                      label="记住我"
                      v-model="loginForm.remember"
                    ></ElCheckbox>
                  </ElFormItem>
                </ElCol> -->
                <ElCol :span="5.5">
                  <ElButton v-if="!isForget" link type="primary" @click="isForget = true">忘记密码</ElButton>
                  <ElButton v-else link type="primary" @click="isForget = false">登录</ElButton>
                </ElCol>
              </ElRow>
              <ElFormItem>
                <ElButton type="primary" :loading="loading" :size="'large'" class="fill" @click="submit">登录</ElButton>
              </ElFormItem>
            </ElSpace>
          </ElForm>
          <ElForm v-else @submit.prevent :model="forgetForm" :rules="{
            ...rules, captcha: [
              {
                required: true,
                message: '请输入验证码',
                trigger: 'blur',
              },
            ],
          }" ref="forgetFormRef">
            <ElSpace :size="10" fill class="fill">
              <ElFormItem prop="email">
                <ElInput v-model="forgetForm.email" placeholder="请输入邮箱" />
              </ElFormItem>
              <ElFormItem prop="password">
                <ElInput type="password" placeholder="请输入密码" v-model="forgetForm.password" />
              </ElFormItem>

            </ElSpace>
            <ElSpace>
              <ElFormItem prop="captcha">
                <div class="flex item-center w-full">
                  <ElInput :size="'large'" v-model="forgetForm.captcha" placeholder="请输入验证码">
                    <template #prefix>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-yanzhengma"></use>
                      </svg>
                    </template>
                  </ElInput>
                  <ElButton class="ml-4" type="primary" @click="send" round :loading="sendLoading"
                    :disabled="cpatchaDiabled">{{ isSend ? `${time}秒后重新获取` : '发送验证码' }}</ElButton>
                </div>
              </ElFormItem>
            </ElSpace>
            <ElSpace :size="10" fill class="fill">
              <ElRow justify="end">

                <ElCol :span="5.5">
                  <ElButton v-if="!isForget" link type="primary" @click="isForget = true">忘记密码</ElButton>
                  <ElButton v-else link type="primary" @click="isForget = false">登录</ElButton>
                </ElCol>
              </ElRow>
              <ElFormItem>
                <ElButton type="primary" :loading="loading" :size="'large'" class="fill" @click="forgetChange">密码重置
                </ElButton>
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
import { omit } from '@/utils/object'
import userStore from '@/store/userStore'
import { sendMail, updateForgetPassword } from '@/http/api'
const cpatchaDiabled = ref(true)
const isForget = ref(false)
const sendLoading = ref(false)
const loading = ref(false)
const isSend = ref(false)
const defaultTime = 60

const time = ref(defaultTime)

type FormType = {
  email: string
  password: string

}
const ruleFormRef = ref<FormInstance>()
const forgetFormRef = ref<FormInstance>()
const loginForm = reactive<FormType>({
  email: '',
  password: '',

})
const forgetForm = reactive<FormType & { captcha: string }>({
  email: '',
  password: '',
  captcha: ''

})



const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入合法邮箱',
      trigger: ['blur'],
    },
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
  const v = await ruleFormRef.value?.validate().catch(() => { })
  if (!v) return
  loading.value = true
  try {
    await user.login(omit(loginForm, ['remember']))
  } finally {
    loading.value = false
  }
}


const forgetChange = async () => {
  if (!forgetFormRef) return
  const v = await forgetFormRef.value?.validate().catch(() => { })
  if (!v) return
  loading.value = true
  try {
    await updateForgetPassword(forgetForm)
    isForget.value = false
  } finally {
    loading.value = false
  }
}

watch(
  () => forgetForm.email,
  n => {
    const regx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (
      n &&
      regx.test(n) &&
      isSend.value === false
    ) {
      cpatchaDiabled.value = false
    }
  },
)
const startTime = () => {
  time.value--
  let t = setInterval(() => {
    if (time.value--) return
    clearInterval(t)
    isSend.value = false
    cpatchaDiabled.value = false
  }, 1000)
}
const send = async () => {
  if (forgetForm.email) {
    sendLoading.value = true
    await sendMail({ email: forgetForm.email, type: 'login' }).finally(
      () => {

        sendLoading.value = false

      },
    )
    cpatchaDiabled.value = true
    isSend.value = true
    startTime()
  }
}

watch(isForget, () => {
  loginForm.email = ''
  loginForm.password = ''
  forgetForm.captcha = ''
  forgetForm.email = ''
  forgetForm.password = ''
})
</script>

<style scoped lang="scss">
@import 'index';
@include useIcon(1.5rem);
</style>
