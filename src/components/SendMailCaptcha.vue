<template>
  <ElDialog
    destroy-on-close
    v-model="emailShow"
    title="修改邮箱"
    :show-close="false"
    align-center
    class="max-w-md"
    @close="countForm = {}"
  >
    <ElForm
      class="w-5/6 mx-auto"
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
          <ElButton
            class="ml-4"
            type="primary"
            @click="send"
            round
            :disabled="cpatchaDiabled"
            >发送验证码</ElButton
          >
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
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { Message } from '@element-plus/icons-vue'
import userStore from '@/store/userStore'
import { sendMail } from '@/http/api'
const cpatchaDiabled = ref(true)
const emailShow = ref(false)
const loading = ref(false)

const ruleFormRef = ref<FormInstance>()
const countForm = ref<{ email?: string; captcha?: string }>({})
const user = userStore()
const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入合法邮箱',
      trigger: ['blur'],
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === user.userInfo.email) {
          return callback(new Error('不能设置重复邮箱'))
        }
        callback()
      },
      trigger: 'blur',
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

const defaultTime = 60 

const time = ref(defaultTime)

const send = async () => {
  if (countForm.value.email) {
    await sendMail({ email: countForm.value.email, type: 'register' })
    
  }
}

watch(
  () => countForm.value.email,
  n => {
    const regx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (n && regx.test(n) && time.value===60) {
      cpatchaDiabled.value = false
    }
  },
)

const submit = async () => {
  const data = await ruleFormRef.value?.validate().catch(() => {})
  if (!data) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emailShow.value = false
  }, 2000)
}

defineExpose({
  open: () => {
    emailShow.value = true
  },
})
</script>

<style scoped lang="scss">
@include useIcon(1.5rem);
</style>
