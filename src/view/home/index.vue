<template>
  <div class="w-full h-full">
    <div class="flex justify-center my-4" v-if="user.auth.length > 1">
      <ElButtonGroup size="large">
        <ElButton
          @click="currentAuth = auth"
          v-for="auth in user.auth"
          :type="currentAuth === auth ? 'primary' : 'default'"
          :key="auth"
          >{{ AuthEnum[auth] }}</ElButton
        >
      </ElButtonGroup>
    </div>
    <div class="h-full bg-slate-300 rounded-md p-4">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  title: '首页',
  orderNo: -1,
  icon: 'icon-shouye',
  name: 'home',
})
</script>
<script setup lang="ts">
import userStore from '@/store/userStore'
import { AuthEnum } from '@/enum/AuthEnum'
const user = userStore()
const router = useRouter()
const route = useRoute()

const currentAuth = ref(user.auth[0])

watch(
  currentAuth,
  newRoute => {
    if (newRoute) {
      router.push({ name: newRoute as any })
    }
  },
  { immediate: true },
)

watch(route, taget => {
  if (taget.name === 'home') router.push({ name: currentAuth.value as any })
})
</script>

<style scoped lang="scss"></style>
