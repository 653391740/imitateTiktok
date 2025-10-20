/**
 * 全局过滤器
 */

// 格式化时间（yyyy-MM-dd）
export const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString().split('/').join('-')
}
// 格式化时间（MM-dd HH:mm）
export const formatTime2 = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const month = date.toLocaleDateString().split('/').slice(1, 3).join('-')
  const time = date.toLocaleTimeString().split(':').slice(0, 2).join(':')
  return month + ' ' + time
}

export const imgSrc = (value) => {
  if (!value) return ''
  return value.includes('http') ? value : 'http://43.138.15.137:3000' + value
}


// 导出所有过滤器
export default {
  formatTime,
  formatTime2,
  imgSrc,
}