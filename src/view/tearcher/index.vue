<template>
  <div>
    教室界面
    <RouterView v-slot="{ Component }">
      <Transition name="fead-test" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  auth: 'teacher',
  redirect: 'class',
  title: '教师',
})
</script>

<script setup lang="ts"></script>

<style scoped lang="scss">

</style>
