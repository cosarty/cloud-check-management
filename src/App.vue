<template>
  <div class="md:container md:mx-auto relative h-10 bg-red-100">
    <!-- <div class="inline-block absolute top-3 left-3 bg-indigo-300">fds</div> -->
    <button @click="submit">提交</button>
    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { Data } from '@server/api'
import http from '@/http'
const data = ref<Data>()
const submit = async () => {
  const res = await http.request<undefined, Data>({ url: '/' })

  data.value = res.data
}
</script>
