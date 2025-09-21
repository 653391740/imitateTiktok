import http from '@/utils/request'

export const getPopularVideo = () => {
  return http.get('/common/video/getPopularVideo')
}

/**
 * 点赞/取消点赞（视频）
 * @param {string} userId 用户id
 * @param {string} videoId 视频id
 * @returns {object} 包含点赞结果的对象
 */
export const triggerLike = (userId, videoId) => {
  return http.get(`/user/${userId}/triggerLike/${videoId}`)
}

/**
 * 获取视频评论
 * @param {string} videoId 视频id
 * @param {number} pageNum 页码
 * @returns {object} 包含评论结果的对象
 */
export const getVideoComment = (videoId, pageNum) => {
  return http.get(`/video/${videoId}/getVideoComment/page/${pageNum}`)
}

/**
 * 发送视频评论
 * @param {string} fromUserId 谁发布的评论
 * @param {string} replyId 回复评论的id (如果是回复评论，否则为空)
 * @param {string} content 评论内容
 * @param {string} toVideoId 评论了哪个视频
 * @returns {object} 包含评论结果的对象
 */
export const sendVideoComment = (data) => {
  return http.post(`/user/commentVideo`, data)
}