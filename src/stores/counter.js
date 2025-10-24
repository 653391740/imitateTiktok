import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/login'
import { getPopularVideo, isLiked } from '@/api/video'
import { FanUnreadNum, byLikeUnreadNum, byCommentUnreadNum, getAtUnreadNum } from '@/api/Chat'
export const chatStore = defineStore('chat', () => {
  const chatList = ref(JSON.parse(localStorage.getItem('chatList')) || [])
  const addChat = (chat) => {
    const index = chatList.value.findIndex(e => e.userId === chat.userId)
    if (index !== -1) {
      chatList.value[index].content = chat.content
    } else {
      chatList.value.push(chat)
    }
    localStorage.setItem('chatList', JSON.stringify(chatList.value))
  }
  const deleteChat = (userId) => {
    const index = chatList.value.findIndex(e => e.userId === userId)
    if (index !== -1) {
      chatList.value.splice(index, 1)
      localStorage.setItem('chatList', JSON.stringify(chatList.value))
    }
  }


  const FanUnreadNumRes = ref(0)
  const byLikeUnreadNumRes = ref(0)
  const byCommentUnreadNumRes = ref(0)
  const getAtUnreadNumRes = ref(0)
  const getAllrequest = async () => {
    try {
      FanUnreadNumRes.value = await FanUnreadNum(loginStore().userinfo.userId)
      byLikeUnreadNumRes.value = await byLikeUnreadNum(loginStore().userinfo.userId)
      byCommentUnreadNumRes.value = await byCommentUnreadNum(loginStore().userinfo.userId)
      getAtUnreadNumRes.value = await getAtUnreadNum(loginStore().userinfo.userId)
    } catch (error) {
      console.log(error);
    }
  }
  return {
    chatList,
    addChat,
    deleteChat,
    FanUnreadNumRes,
    byLikeUnreadNumRes,
    byCommentUnreadNumRes,
    getAtUnreadNumRes,
    getAllrequest
  }
})
export const homeStore = defineStore('home', () => {
  const VideoList = ref([])
  const getVideoList = async () => {
    try { // 获取首页视频内容
      const res = await getPopularVideo();
      const data = res.map(e => JSON.parse(e))
      const updatedData = await Promise.allSettled(data.map(async e => {
        if (!e.Video) return e
        try {
          const likedRes = await isLiked(loginStore().userinfo.userId, e.Video.videoId)
          e.isLiked = likedRes
        } catch (error) {
          console.error(`获取视频 ${e.Video.videoId} 点赞状态失败:`, error);
          e.isLiked = false; // 设置默认值
        }
        return e
      }))
      VideoList.value.push(...updatedData)
    } catch (error) {
      console.log(error);
    }
  }
  return {
    VideoList,
    getVideoList
  }
})
export const commentStore = defineStore('comment', () => {
  const showPopup = ref(false)
  const commentNum = ref(0)
  const commentId = ref('')
  const replyId = ref('') // 未开发
  const openCommentPopup = (id, num) => {
    if (!loginStore().userinfo) return loginStore().loginShow = true
    showPopup.value = true
    commentNum.value = num
    commentId.value = id
  }
  return {
    showPopup,
    commentNum,
    commentId,
    replyId,
    openCommentPopup
  }
})
export const loginStore = defineStore('login', () => {
  const loginShow = ref(false)
  const registerShow = ref(false)
  const registerTime = ref(60)
  const findPasswordShow = ref(false)
  const findPasswordTime = ref(60)
  const userinfo = ref(JSON.parse(localStorage.getItem('tiktok_userinfo')) || {})

  const closeLogin = (newUserinfo) => {
    if (newUserinfo) userinfo.value = { ...newUserinfo }
    loginShow.value = false
    formData.value = {
      email: '',
      password: ''
    }
  }
  const updateUserInfo = (newUserinfo) => {
    userinfo.value = { ...newUserinfo }
    localStorage.setItem('tiktok_userinfo', JSON.stringify(newUserinfo))
  }

  const formData = ref({
    email: '583514368@qq.com',
    password: '123456'
  })

  const Login = async (proxy) => {
    try {
      proxy.$toast.loading('')
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { userId } = await login(formData.value) // 登录
      const res = await getUserInfo(userId) // 获取到个人信息
      updateUserInfo(res)
      proxy.$toast.show('登录成功')
      closeLogin(res)
    } catch (error) {
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) proxy.$toast.show('请求超时，请检查网络连接后重试')
      const errorMessage = error.response.data.message === 'email or password error'
      if (errorMessage) proxy.$toast.show(errorMessage)
    }
  }
  return {
    loginShow,
    registerShow,
    findPasswordShow,
    findPasswordTime,
    userinfo,
    registerTime,
    closeLogin,
    Login,
    updateUserInfo,
    formData
  }
})

