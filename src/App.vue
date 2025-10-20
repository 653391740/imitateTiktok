<script setup>
import { getCurrentInstance } from 'vue'
import { loginStore } from '@/stores/counter'
const { proxy } = getCurrentInstance()
const LoginStore = loginStore()
LoginStore.Login(proxy)
</script>

<template>
<RouterView></RouterView>
</template>

<style scoped
  lang="scss"></style>
