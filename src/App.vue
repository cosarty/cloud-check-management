<template>
  <div>fgfd</div>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { Data } from '@server/api'
// import HelloWorld from './components/HelloWorld.vue'
import http from '@/http'
const data = ref<Data>()

const submit = async () => {
  const res = await http.request<undefined, Data>({ url: '/' })

  data.value = res.data
}
</script>

<style scoped lang="scss">
.box {
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: aqua;
    top: calc(50% - 1px);
    left: 0;
  }

  &_active {
    & ~ & {
      color: red;
    }
  }
}
</style>
