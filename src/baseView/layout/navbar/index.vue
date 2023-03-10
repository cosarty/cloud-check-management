<template>
  <ElHeader class="header">
    <div class="title">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xitongguanliyuanguanli"></use>
      </svg>
      点名管理系统
    </div>
    <div class="extra">
      <div class="extra-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiaoxi"></use>
        </svg>
        <div class="lable">消息</div>
      </div>
      <ElDropdown popper-class="profile" @command="handleCommand">
        <div class="extra-item">
          <ElAvatar :size="27" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            style="margin-right: 0.7rem;" />

          <div class="lable">
            我的
            <ElIcon :size="16" style="margin-left: 0.4rem">
              <ArrowDown />
            </ElIcon>
          </div>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="profile">个人中心</ElDropdownItem>
            <ElDropdownItem command="logout">退出登录</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </ElHeader>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import userStore from '@/store/userStore'
const user = userStore()
const router = useRouter()
const handleCommand = (command: string) => {
  console.log('command: ', command)
  switch (command) {
    case 'logout':
      user.logout()
      break;
    case 'profile':
      router.push({ name: 'profile' })
      break;
  }
}
</script>

<style scoped lang="scss">
@import 'index';
</style>

<style lang="scss">
.profile {}
</style>
