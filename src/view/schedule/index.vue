<template>
  <div style="background-color: white; height: 100%" class="box-border">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>


  </div>
</template>

<script lang="ts">
export default defineComponent({
  title: '活动',
  icon: 'icon-kecheng',
  name: 'schedule',
  auth: ['teacher'],
  redirect: 'areaMange',
  orderNo: 11,
})
</script>
<script setup lang="ts"></script>

<style scoped lang="scss"></style>
