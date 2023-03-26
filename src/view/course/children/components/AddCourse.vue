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
          name="courseAvatarDir"
        >
          <ElAvatar
            :size="100"
            :src="
              ruleForm.picture ??
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
            shape="square"
          />
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="课程名" required prop="courseName">
        <ElInput v-model.number="ruleForm.courseName" placeholder="课程名" />
      </ElFormItem>
      <ElFormItem
        label="老师"
        prop="userId"
        required
        v-if="user.auth.includes('super')"
      >
        <ElSelect
          v-model="ruleForm.userId"
          class="w-full"
          placeholder="选择老师"
        >
          <ElOption
            :label="op.userName"
            :value="op.userId"
            v-for="op in options"
            :key="op.userId"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="备注" prop="comment">
        <ElInput v-model="ruleForm.comment" placeholder="请输入备注" />
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
  createCourse,
  getClassList,
  getTeacher,
  register,
  updateCourse,
  updateOtherUser,
} from '@/http/api'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import userStore from '@/store/userStore'

const actionUrl =
  import.meta.env.VITE_APP_API_BASE_URL + '/upload/courseAvatarDir'

const user = userStore()
const porps = defineProps<{
  title: string
}>()
const dialogVisible = ref(false)
const coTitle = ref(porps.title)

const emit = defineEmits<{ (e: 'reset'): void }>()
const options = ref<{ userName: string; userId: string }[]>([])
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<any>({})
const readonly = ref(false)
const rules = reactive<FormRules>({
  courseName: [{ required: true, message: '请输入课程名', trigger: 'blur' }],
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

  if (!ruleForm.value.courseId) {
    await createCourse({
      ...ruleForm.value,
      ...(ruleForm.value.picture
        ? { picture: ruleForm.value.picture.split('/').pop() }
        : {}),
    })
  } else {
    await updateCourse({
      ...ruleForm.value,
      ...(ruleForm.value.picture
        ? { picture: ruleForm.value.picture.split('/').pop() }
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
  ruleForm.value.picture = response.data
}

watch(dialogVisible, async vi => {
  if (!vi) {
    ruleForm.value = {}
    coTitle.value = porps.title
    readonly.value = false
  } else {
    if (user.auth.includes('super')) {
      const { data } = await getTeacher({ flag: 'all' })
      options.value = data.rows
    }
  }
})

defineExpose({
  updateData,
})
</script>
<style scoped></style>
