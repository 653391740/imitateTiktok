<script setup>
import { Suspense } from 'vue';
</script>

<template>
  <Suspense>
    <template #default>
      <router-view></router-view>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<style scoped lang="scss"></style>
