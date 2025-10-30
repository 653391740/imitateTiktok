import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/login'
import { getPopularVideo, isLiked } from '@/api/video'
import { FanUnreadNum, byLikeUnreadNum, byCommentUnreadNum, getAtUnreadNum } from '@/api/Chat'

export const searchStore = defineStore('search', () => {
  const inputvalue = ref('')
  return {
    inputvalue
  }
})

export const chatStore = defineStore('chat', () => {
  const socket = inject("socket");
  const chatList = ref(JSON.parse(localStorage.getItem('chatList')) || [])
  const addChat = (chat) => {
    const index = chatList.value.findIndex(e => e.info.userId === chat.userId)
    if (index !== -1) {
      chatList.value[index].info.privateLetterContent = chat.privateLetterContent
      chatList.value[index].info.createdAt = chat.createdAt
    } else {
      chatList.value.push({
        info: { ...chat },
        newMsg: 0
      })
    }
    localStorage.setItem('chatList', JSON.stringify(chatList.value))
  }
  const receiveChat = (chat) => {
    const index = chatList.value.findIndex(e => e.info.userId === chat.fromId)
    if (index !== -1) {
      chatList.value[index].info.privateLetterContent = chat.privateLetterContent
      chatList.value[index].info.createdAt = chat.createdAt
      chatList.value[index].newMsg++
    } else {
      const { fromId, ...item } = chat
      chatList.value.push({
        info: { ...item, userId: fromId },
        newMsg: 0
      })
    }
    localStorage.setItem('chatList', JSON.stringify(chatList.value))
  }
  const deleteChat = (userId) => {
    const index = chatList.value.findIndex(e => e.info.userId === userId)
    if (index !== -1) {
      chatList.value.splice(index, 1)
      localStorage.setItem('chatList', JSON.stringify(chatList.value))
    }
  }
  const receive = () => {
    socket.on('receivePrivateLetter', data => {
      receiveChat(data)
    })
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
      console.log(FanUnreadNumRes.value, byLikeUnreadNumRes.value, byCommentUnreadNumRes.value, getAtUnreadNumRes.value);
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
    getAllrequest,
    receive
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
      console.log(VideoList.value);
    } catch (error) {
      console.log(error);
    }
  }
  const falseVideoList = () => {
    VideoList.value.map(e => e.isLiked = false)
  }
  return {
    VideoList,
    getVideoList,
    falseVideoList
  }
})
export const commentStore = defineStore('comment', () => {
  const showPopup = ref(false)
  const commentNum = ref(0)
  const commentId = ref('')
  const replyId = ref('') // 未开发
  const openCommentPopup = (id, num) => {
    console.log(1);
    if (!loginStore().userinfo) return loginStore().loginShow = true
    console.log(1);
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
  const socket = inject("socket");
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

  const logout = () => {
    localStorage.removeItem('tiktok_userinfo')
    homeStore().falseVideoList()
    userinfo.value = {}
  }

  const updateUserInfo = (newUserinfo) => {
    userinfo.value = { ...newUserinfo }
    localStorage.setItem('tiktok_userinfo', JSON.stringify(newUserinfo))
  }

  const formData = ref(JSON.parse(localStorage.getItem('userinfo')) || {
    email: '',
    password: ''
  })

  const Login = async (proxy) => {
    console.log(formData.value);
    if (formData.value.email === '') return loginShow.value = true
    try {
      proxy.$toast.loading('')
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { userId } = await login(formData.value) // 登录
      const res = await getUserInfo(userId) // 获取到个人信息
      socket.emit('login', userId)
      chatStore().getAllrequest()
      localStorage.setItem('userinfo', JSON.stringify(formData.value))
      updateUserInfo(res)
      proxy.$toast.show('登录成功')
      closeLogin(res)
    } catch (error) {
      console.log(error);
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) proxy.$toast.show('请求超时，请检查网络连接后重试')
      if (error.response.data.message === 'email or password error') proxy.$toast.show('邮箱或密码错误')
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
    logout,
    formData
  }
})

