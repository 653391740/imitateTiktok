/**
 * 防抖函数
 */
const debounce = (func, wait = 300, immediate = true) => {
  let timeout
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timeout)
    if (immediate && !timeout) func.apply(context, args)
    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
  }
}

/**
 * 节流函数
 */
const throttle = (func, wait = 500) => {
  let previous = 0
  return function () {
    const context = this
    const args = arguments
    const now = Date.now()
    if (now - previous > wait) {
      console.log(1);
      previous = now
      func.apply(context, args)
    }
  }
}

const install = (app) => {
  app.config.globalProperties.$debounce = debounce
  app.config.globalProperties.$throttle = throttle
  app.provide('debounce', debounce)
  app.provide('throttle', throttle)
}

export default install