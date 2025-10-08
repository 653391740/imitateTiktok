<script setup>
</script>

<template><keep-alive>
  <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view></template>

<style scoped
  lang="scss">
  div {
    width: 100%;
    height: 100vh;
  }
</style>
