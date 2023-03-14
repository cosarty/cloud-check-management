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
        <ElInput model-value="蔡夏柠" placeholder="请输入姓名" readonly />
      </ElFormItem>
      <ElFormItem label="学号：">
        <ElInput model-value="212106601" placeholder="请输入学号" readonly />
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
          model-value="计算机科学与技术"
          placeholder="请选择班级"
          readonly
        />
      </ElFormItem>
      <ElFormItem label="系别：">
        <ElInput model-value="信息工程系" placeholder="请选择班级" readonly />
      </ElFormItem>
      <ElFormItem label="邮箱：">
        <div class="flex items-center">
          <ElInput
            model-value="信息工程系"
            placeholder="请输入邮箱"
            readonly
          /><ElIcon :size="20" class="cursor-pointer"> <Edit /></ElIcon>
        </div>
      </ElFormItem>
    </ElForm>
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
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, UploadProps, UploadRawFile } from 'element-plus'
const user = userStore()

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
</script>

<style scoped lang="scss">
.count-box {
  padding-left: 2rem;
}
</style>
