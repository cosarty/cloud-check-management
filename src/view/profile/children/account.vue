<template>
  <div>
    <ElForm>
      <ElFormItem label="姓名">
        <ElInput model-value="蔡夏柠" placeholder="请输入姓名" readonly />
      </ElFormItem>
      <ElFormItem label="学号">
        <ElInput model-value="212106601" placeholder="请输入学号" readonly />
      </ElFormItem>
      <ElFormItem label="性别">
        <el-radio-group class="ml-3">
          <el-radio label="1">女</el-radio>
          <el-radio label="0">男</el-radio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="班级">
        <ElInput model-value="计算机科学与技术" placeholder="请选择班级" readonly />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '基本资料'
})
</script>

<script setup lang="ts">

</script>

<style scoped></style>