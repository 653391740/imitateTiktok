import { ref } from 'vue'
import { defineStore } from 'pinia'

export const commentStore = defineStore('comment', () => {
  const showPopup = ref(false)
  const commentNum = ref(0)
  const commentId = ref('')
  const replyId = ref('') // 未开发
  return {
    showPopup,
    commentNum,
    commentId,
    replyId,
  }
})
export const loginStore = defineStore('login', () => {
  const loginShow = ref(false)
  const registerShow = ref(false)
  const registerTime = ref(60)
  const findPasswordShow = ref(false)
  const findPasswordTime = ref(60)
  const userId = ref(JSON.parse(localStorage.getItem('tiktok_userinfo'))?.userId || '')

  const closeLogin = (Id) => {
    loginShow.value = false
    userId.value = Id
  }

  return {
    loginShow,
    registerShow,
    findPasswordShow,
    findPasswordTime,
    userId,
    registerTime,
    closeLogin,
  }
})