<script setup>
import CommentPopup from '@/components/comment/commentPopup.vue'
import { getCurrentInstance, inject } from 'vue'
import { loginStore, chatStore } from '@/stores/counter'
const { proxy } = getCurrentInstance()
const LoginStore = loginStore()
LoginStore.Login(proxy)
const ChatStore = chatStore()
ChatStore.receive()

</script>

<template>
  <RouterView></RouterView>
  <CommentPopup></CommentPopup>
</template>

<style scoped lang="scss"></style>
