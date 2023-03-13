<template>
  <div>
    <ElCard>
      <div>
        <h2>账号管理</h2>
      </div>
      <ElTabs v-model="activeName">
        <ElTabPane label="User" name="first">基本资料</ElTabPane>
        <ElTabPane label="Config" name="second">修改头像</ElTabPane>
        <ElTabPane label="Role" name="third">修改密码</ElTabPane>
      </ElTabs>
    </ElCard>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '个人中心',
  hideMenu: true,
})
</script>
<script setup lang="ts">
const activeName = ref('first')
</script>

<style scoped lang="scss"></style>
