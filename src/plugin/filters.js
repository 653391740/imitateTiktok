/**
 * 全局过滤器
 */

// 格式化时间（yyyy-MM-dd）
const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString().split('/').join('-')
}
// 格式化时间（MM-dd HH:mm）
const formatTime2 = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const month = date.toLocaleDateString().split('/').slice(1, 3).join('-')
  const time = date.toLocaleTimeString().split(':').slice(0, 2).join(':')
  return month + ' ' + time
}

const imgSrc = (value) => {
  if (!value) return ''
  return value.includes('http') ? value : 'http://43.138.15.137:3000' + value
}
const install = (app) => {
  // 全局挂载 $toast 方法
  app.config.globalProperties.$formatTime = formatTime
  app.config.globalProperties.$formatTime2 = formatTime2
  app.config.globalProperties.$imgSrc = imgSrc

  // 提供全局注入
  app.provide('formatTime', formatTime)
  app.provide('formatTime2', formatTime2)
  app.provide('imgSrc', imgSrc)
}
export default install
