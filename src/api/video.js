import http from '@/utils/request'

export const getPopularVideo = () => {
  return http.get('/common/video/getPopularVideo')
}