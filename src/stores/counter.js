import { ref, inject, computed } from 'vue'
import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/login'
import { getContact } from '@/api/user'
import { FanUnreadNum, byLikeUnreadNum, byCommentUnreadNum, getAtUnreadNum } from '@/api/Chat'
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
  const addChat = (chat) => { // 发送消息 --- 信息更新
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
  const receiveChat = (chat) => { // 接收消息 --- 信息更新
    const index = chatList.value.findIndex(e => e.info.userId === chat.fromId)
    if (index !== -1) {
      chatList.value[index].info.content = chat.content
      chatList.value[index].info.createdAt = chat.createdAt
      chatList.value[index].newMsg++
    } else {
      const { fromId, ...item } = chat
      chatList.value.push({
        info: { ...item, userId: fromId },
        newMsg: 1
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
  const clearAllnewMsg = () => {
    chatList.value.forEach(e => e.newMsg = 0)
    localStorage.setItem('chatList', JSON.stringify(chatList.value))
  }
  const receive = () => {
    socket.on('receivePrivateLetter', data => {
      receiveChat(data)
    })
  }
  const dot = computed(() => {
    const newMsg = chatList.value.some(e => e.newMsg > 0)
    return Array.from([FanUnreadNumRes.value, byLikeUnreadNumRes.value, byCommentUnreadNumRes.value, getAtUnreadNumRes.value, newMsg]).some(e => e > 0)
  })

  const ContactList = ref([])
  const FanUnreadNumRes = ref(0)
  const byLikeUnreadNumRes = ref(0)
  const byCommentUnreadNumRes = ref(0)
  const getAtUnreadNumRes = ref(0)
  const socketAccept = (userId) => {
    socket.on('receiveComment', async data => {
      byCommentUnreadNumRes.value = await byCommentUnreadNum(userId)
    })
    socket.on('receiveTriggerLike', async data => {
      byLikeUnreadNumRes.value = await byLikeUnreadNum(userId)
    })
    socket.on('receiveTriggerFollow', async data => {
      FanUnreadNumRes.value = await FanUnreadNum(userId)
    })
  }
  const getAllrequest = async (userId) => {
    console.log(userId);

    try {
      ContactList.value = await getContact(userId)
      FanUnreadNumRes.value = await FanUnreadNum(userId)
      byLikeUnreadNumRes.value = await byLikeUnreadNum(userId)
      byCommentUnreadNumRes.value = await byCommentUnreadNum(userId)
      getAtUnreadNumRes.value = await getAtUnreadNum(userId)
    } catch (error) {
      console.log(error);
    }
  }
  return {
    ContactList,
    chatList,
    addChat,
    deleteChat,
    clearAllnewMsg,
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
      const { userId } = await login(formData.value)
      const res = await getUserInfo(userId)
      updateUserInfo(res) // 更新个人信息
      Promise.all([
        socket.emit('login', userId),
        chatStore().getAllrequest(userId),
      ])
      chatStore().receive() // 接收消息
      chatStore().socketAccept(userId) // 连接socket
      localStorage.setItem('userinfo', JSON.stringify(formData.value)) // 存储账号登录信息
      proxy.$toast.show('登录成功')
      closeLogin(res)
    } catch (error) {
      const { message } = error
      if (message === 'email or password error') {
        if (userinfo.value.userId) {
          logout()
          proxy.$toast.show('登录状态已失效，请重新登录')
          return
        }
        proxy.$toast.show('邮箱或密码错误')
        loginShow.value = true
      }
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

