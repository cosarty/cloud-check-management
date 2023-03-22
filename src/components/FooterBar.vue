<template>
  <ElFooter class="footer">底部</ElFooter>
</template>

<script setup lang="ts">
// 50px
</script>

<style scoped lang="scss">
.footer {
  box-shadow: 0 -4px 5px -4px rgba(57, 58, 59, 0.5);
  height: $footer-bar-height;
  position: fixed;
  bottom: 0;
  left: $siderbar-width;
  right: 0;
  background-color: white;
  :global(:root) {
    --footer-bar-height: calc(#{$footer-bar-height} + 10px);
  }
}
</style>
