<template>
  <div class="count-box mt-4">
    <div class="mb-4">
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
      <ElFormItem
        :label="user.auth.includes('student') ? '学号：' : '教师编号'"
      >
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
      <ElFormItem label="班级：" v-if="user.auth.includes('student')">
        <ElInput
          :model-value="user.userInfo.class?.className"
          placeholder="请选择班级"
          readonly
        />
      </ElFormItem>
      <ElFormItem label="系别:" v-if="user.auth.includes('teacher')">
        <ElInput
          :model-value="user.userInfo.department?.departmentName"
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
          /><ElIcon :size="20" class="cursor-pointer" @click="open">
            <Edit
          /></ElIcon>
        </div>
      </ElFormItem>
      <ElFormItem label="身份：">
        <div class="flex items-center">
          <el-tag
            v-for="au in user.auth"
            :key="au"
            class="ml-2"
            type="success"
            >{{ AuthEnum[au] }}</el-tag
          >
        </div>
      </ElFormItem>
    </ElForm>

    <SendMailCaptcha ref="mailRef" />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '基本资料',
  coverRouter: true,
})
</script>

<script setup lang="ts">
import userStore from '@/store/userStore'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, UploadProps } from 'element-plus'
import { updateUser } from '@/http/api'
import SendMailCaptcha from '@/components/SendMailCaptcha.vue'
import { AuthEnum } from '@/enum/AuthEnum'

const actionUrl =
  import.meta.env.VITE_APP_API_BASE_URL + '/upload/userAvatarDir'

const user = userStore()
const mailRef = ref<InstanceType<typeof SendMailCaptcha>>()

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

const open = () => {
  mailRef.value?.open()
}
</script>

<style scoped lang="scss">
.count-box {
  padding-left: 2rem;
  :deep(.el-input .el-input__wrapper:has(.el-input__inner[readonly])) {
    box-shadow: none !important;
  }
}
</style>
