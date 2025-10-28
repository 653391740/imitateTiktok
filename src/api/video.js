import http from '@/utils/request'

export const getPopularVideo = () => {
  return http.get('/common/video/getPopularVideo')
}

export const triggerLike = (userId, videoId) => {
  return http.get(`/user/${userId}/triggerLike/${videoId}`)
}

export const getVideoComment = (videoId, pageNum) => {
  return http.get(`/video/${videoId}/getVideoComment/page/${pageNum}`)
}

export const isLiked = (userId, videoId) => {
  return http.get(`/user/${userId}/isLiked/${videoId}`)
}

export const isLikedComment = (userId, commentId) => {
  return http.get(`/user/${userId}/isLikedComment/${commentId}`)
}

export const sendVideoComment = (data) => {
  return http.post(`/user/commentVideo`, data)
}

export const triggerLikeComment = (userId, videoId, commentId) => {
  return http.get(`/user/${userId}/triggerLikeComment/${videoId}/${commentId}`)
}

export const FollowerVideo = (userId, page) => {
  return http.get(`user/${userId}/FollowerVideo/page/${page}`)
}

export const uploadFile = (data) => {
  return http.post(`user/uploadFile`, data)
}

export const uploadCover = (data) => {
  return http.post(`user/uploadCover`, data)
}

export const publishVideo = (uid, data) => {
  return http.post(`user/${uid}/publishVideo`, data)
}

export const searchVideo = (uid, page, data) => {
  return http.post(`user/${uid}/searchVideo/${page}`, data)
}

export const searchUser = (uid, page, data) => {
  return http.post(`user/${uid}/searchUser/${page}`, data)
}