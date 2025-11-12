import { ref, inject, computed } from 'vue'
import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/login'
import { getPopularVideo, isLiked } from '@/api/video'
import { FanUnreadNum, byLikeUnreadNum, byCommentUnreadNum, getAtUnreadNum } from '@/api/Chat'
import { Toast } from '@/plugin/Toast/index.js';
export const searchStore = defineStore('search', () => {
  const inputvalue = ref('')
  const searchType = ref('video')
  return {
    inputvalue,
    searchType
  }
})

export const chatStore = defineStore('chat', () => {
  const socket = inject("socket");
  const chatList = ref(JSON.parse(localStorage.getItem('chatList')) || [])
  const addChat = (chat) => {
    const index = chatList.value.findIndex(e => e.info.userId === chat.userId)
    if (index !== -1) {
      chatList.value[index].info.content = chat.content
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
      chatList.value[index].info.content = chat.content
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
  const dot = computed(() => {
    return Array.from([FanUnreadNumRes.value, byLikeUnreadNumRes.value, byCommentUnreadNumRes.value, getAtUnreadNumRes.value]).some(e => e > 0)
  })

  const FanUnreadNumRes = ref(0)
  const byLikeUnreadNumRes = ref(0)
  const byCommentUnreadNumRes = ref(0)
  const getAtUnreadNumRes = ref(0)
  const socketAccept = () => {
    socket.on('receiveComment', async data => {
      console.log(data);

      byCommentUnreadNumRes.value = await byCommentUnreadNum(loginStore().userinfo.userId)
    })
    socket.on('receiveTriggerLike', async data => {
      console.log(data);
      byLikeUnreadNumRes.value = await byLikeUnreadNum(loginStore().userinfo.userId)
    })
    socket.on('receiveTriggerFollow', async data => {
      console.log(data);
      FanUnreadNumRes.value = await FanUnreadNum(loginStore().userinfo.userId)
    })
  }
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
    getAllrequest,
    receive,
    socketAccept,
    dot
  }
})
export const homeStore = defineStore('home', () => {
  const VideoList = ref([])
  const isLoading = ref(false)
  const status = ref(200)
  const getVideoList = async () => {
    try { // 获取首页视频内容
      isLoading.value = true
      const res = await getPopularVideo();
      const data = res.map(e => JSON.parse(e))
      VideoList.value.push(...data)
      if (!loginStore()?.userinfo.userId) {
        data.forEach(e => e.isLiked = false)
        VideoList.value.push(...data)
      } else {
        VideoList.value.map(async e => {
          if (!e.Video) return e
          try {
            const likedRes = await isLiked(loginStore().userinfo.userId, e.Video.videoId)
            e.isLiked = likedRes
          } catch (error) {
            if (error.response.data.code === 'auth:not logged in') {
              loginStore().logout()
              Toast.show('登录状态已失效，请重新登录')
              return e
            }
            e.isLiked = false;
          }
          return e
        })
      }
    } catch (error) {
      console.log(error);
      status.value = error.status
    } finally {
      isLoading.value = false
    }
  }
  const falseVideoList = () => {
    VideoList.value.map(e => e.isLiked = false)
  }
  return {
    status,
    VideoList,
    isLoading,
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
    localStorage.removeItem('userinfo')
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
    if (formData.value.email === '') return
    try {
      proxy.$toast.loading('')
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { userId } = await login(formData.value) // 登录
      const res = await getUserInfo(userId) // 获取到个人信息
      updateUserInfo(res)
      chatStore().getAllrequest()
      chatStore().socketAccept()
      chatStore().receive()
      socket.emit('login', userId)
      localStorage.setItem('userinfo', JSON.stringify(formData.value))
      formData.value.password = ''
      proxy.$toast.show('登录成功')
      closeLogin(res)
    } catch (error) {
      console.log(error);
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) proxy.$toast.show('请求超时，请检查网络连接后重试')
      if (error.response?.data.message === 'email or password error') {
        if (userinfo.value.userId) {
          logout()
          proxy.$toast.show('登录状态已失效，请重新登录')
          return
        }
        proxy.$toast.show('邮箱或密码错误')
        loginShow.value = true
        return
      }
      proxy.$toast.show('无网络连接，请检查网络后重试')
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

