<template>
  <div>
    <ElCard>
      <div class="profile-title mb-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-geren"></use>
        </svg>
        <h2>账号管理</h2>
      </div>

      <Tabs :tab-list="tabList"/>
    </ElCard>
  </div>
</template>

<script lang="ts">

export default defineComponent({
  title: '个人中心',
  hideMenu: true,
  redirect: 'account',
  name:'profile'
})
</script>
<script setup lang="ts">
import { TabItemType } from '@/components/Tabs.vue';

const tabList: TabItemType[] = [{
  label: '基本资料',
  name: 'account',
  route: true
},
{
  label: '更新头像',
  name: 'updateAvatar',
  route: true
},
{
  label: '忘记密码',
  name: 'forget',
  route: true
},
]

</script>

<style scoped lang="scss">
.profile-title {
  display: flex;
  align-items: center;
  font-size: 17.5px;
  font-weight: 600;

  @include useIcon(3rem) {
    margin-right: 10px;
  }

  ;
}
</style>
