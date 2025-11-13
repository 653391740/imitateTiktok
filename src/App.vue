<script setup>
import CommentPopup from '@/components/comment/commentPopup.vue'
import { getCurrentInstance, inject } from 'vue'
import { loginStore } from '@/stores/counter'
const { proxy } = getCurrentInstance()
const LoginStore = loginStore()
LoginStore.Login(proxy)

</script>

<template>
  <router-view></router-view>
  <CommentPopup></CommentPopup>
</template>

<style scoped lang="scss"></style>
