import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const commentStore = defineStore('comment', () => {
  const showPopup = ref(false)
  return {
    showPopup,
  }
})
export const loginStore = defineStore('login', () => {
  const loginShow = ref(false)
  const registerShow = ref(false)
  const registerTime = ref(60)
  const findPasswordShow = ref(false)
  const findPasswordTime = ref(60)
  const isLogin = Boolean(localStorage.getItem('tiktok_userinfo'))

  const closeLogin = () => {
    loginShow.value = false
    isLogin = true
  }

  return {
    loginShow,
    registerShow,
    findPasswordShow,
    findPasswordTime,
    isLogin,
    registerTime,
    closeLogin,
  }
})