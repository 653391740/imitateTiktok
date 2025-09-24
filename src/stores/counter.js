import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/login'
import { getPopularVideo, isLiked } from '@/api/video'

export const homeStore = defineStore('home', () => {
  const VideoList = ref([])
  const getVideoList = async () => {
    try { // 获取首页视频内容
      const res = await getPopularVideo();
      const data = res.map(e => JSON.parse(e))
      const updatedData = await Promise.allSettled(data.map(async e => {
        if (!e.Video) return e
        try {
          const likedRes = await isLiked(loginStore().userId, e.Video.videoId)
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
    if (!loginStore().userId) return loginStore().loginShow = true
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
    if (newUserinfo) userinfo.value = newUserinfo
    loginShow.value = false
    formData.value = {
      email: '',
      password: ''
    }
  }

  const formData = ref({
    email: '653391740@qq.com',
    password: 'qqqqqq'
  })

  const Login = async (proxy) => {
    try {
      proxy.$toast.loading('')
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { userId } = await login(formData.value) // 登录
      const res = await getUserInfo(userId) // 获取到个人信息
      localStorage.setItem('tiktok_userinfo', JSON.stringify(res))
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
    formData
  }
})