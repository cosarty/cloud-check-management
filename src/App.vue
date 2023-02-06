<template>
  <div class="md:container md:mx-auto relative h-10 bg-red-100">
    <!-- <div class="inline-block absolute top-3 left-3 bg-indigo-300">fds</div> -->
    <button @click="submit">提交</button>
    {{ data }}
  </div>

  <div
    class="relative box h-60 w-70 mx-auto my-10 bg-red-200 text-center leading-70"
  >
    <span
      class="box_active inline-block h-full w-3 align-middle bg-blue-300"
    ></span>
    <span
      class="box_active inline-block w-10 h-10 align-middle bg-lime-600 text-lg"
    ></span
    ><span class="text-6xl align-middle">x写fhdskj</span>
  </div>
</template>

<script setup lang="ts">
import { Data } from '@server/api'
import HelloWorld from './components/HelloWorld.vue'
console.log('HelloWorld: ', HelloWorld)
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
