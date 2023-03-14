<template>
  <ElTabs :model-value="activeName" @tab-change="tabChangeHandle">
    <ElTabPane v-for="(tab, idx) in tabList" :key="idx" :label="tab.label" :name="tab.name">
      <component v-if="tab.componnet" :is="tab.componnet" />
      <RouterView v-if="tab.route" v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </ElTabPane>

  </ElTabs>
</template>

<script setup lang="ts">
import { TabPaneName } from 'element-plus';
import type { Component } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router'
export type TabItemType = {
  name: string,
  label: string,
  componnet?: string | Component,
  event?: (name: TabPaneName) => void,
  route?: boolean
}

const avtiveItem = ref<TabItemType>()

const router = useRouter()
const props = defineProps<{
  tabList: TabItemType[]
}>()

onBeforeRouteUpdate((to) => {
  const ac = props.tabList.find((t) => t.name === to.name)
  if (ac && ac.route) {
    avtiveItem.value = ac
  }
})
onMounted(() => {
  avtiveItem.value = props.tabList[0]
})


const activeName = computed(() => avtiveItem.value?.name)
const tabChangeHandle = (name: TabPaneName) => {
  const aci = props.tabList.find((t) => t.name === name)
  if (aci?.event) aci.event(name)
  if (aci?.route) router.push({ name: aci.name });
  else {
    avtiveItem.value = aci
  }
}



</script>

<style scoped></style>