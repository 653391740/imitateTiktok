// 自定义指令集合
import { nextTick } from 'vue'
import slotdefaultsrc from '@/assets/slotdefault.svg'
import defaultsrc from '@/assets/default.png'
/**
 * 图片懒加载指令
 * 使用方法: <img v-lazy="src" />
 */
const lazy = {
  mounted(el, binding) {
    const { src, slot = slotdefaultsrc, error = defaultsrc } = binding.value || {}
    el.src = slot
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value || src

          // 图片加载完成后取消观察
          el.onload = () => {
            observer.unobserve(el)
          }

          // 图片加载失败处理
          el.onerror = () => {
            el.src = error
            observer.unobserve(el)
          }
        }
      })
    }, {
      // 当图片有10%进入视口时就开始加载
      threshold: 0.1
    })

    // 开始观察元素
    observer.observe(el)

    // 将observer实例存储在元素上，便于在卸载时取消观察
    el._lazyObserver = observer
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.src = binding.value
    }
  },
  // 元素卸载时取消观察，避免内存泄漏
  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      delete el._lazyObserver
    }
  }
}

/**
 * 长按指令
 * 使用方法: <div v-longpress="() => console.log('长按触发')">长按我</div>
 */
const longpress = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('v-longpress指令需要接收一个函数作为参数')
      return
    }

    let pressTimer = null

    const start = (e) => {
      // 防止与点击事件冲突
      if (e.type === 'click' && e.detail === 0) return

      // 设置长按计时器，500ms后触发
      pressTimer = setTimeout(() => {
        binding.value(e)
      }, 500)
    }

    const cancel = () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    // 添加事件监听
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)

    // 将事件处理函数存储在元素上，便于在卸载时移除
    el._longpressHandlers = { start, cancel }
  },

  unmounted(el) {
    if (el._longpressHandlers) {
      const { start, cancel } = el._longpressHandlers

      // 移除事件监听
      el.removeEventListener('mousedown', start)
      el.removeEventListener('touchstart', start)
      el.removeEventListener('mouseup', cancel)
      el.removeEventListener('mouseleave', cancel)
      el.removeEventListener('touchend', cancel)
      el.removeEventListener('touchcancel', cancel)

      delete el._longpressHandlers
    }
  }
}

/**
 * 防抖指令
 * 使用方法: <button v-debounce:300="() => console.log('点击')">防抖按钮</button>
 */
const debounce = {
  mounted(el, binding) {
    let timer = null
    const delay = Number(binding.arg) || 500
    const eventType = Object.keys(binding.modifiers)[0] || 'click'
    el._eventType = eventType

    el._debounceHandler = (e) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value(e) // 传递事件对象
      }, delay)
    }

    el.addEventListener(eventType, el._debounceHandler)
  },

  unmounted(el) {
    if (el._debounceHandler) {
      const eventType = el._eventType || 'click'
      el.removeEventListener(eventType, el._debounceHandler)
      delete el._debounceHandler
      delete el._eventType
    }
  }
}


/**
 * 节流指令
 * 使用方法: <button v-throttle:300="() => console.log('点击')">节流按钮</button>
 */
const throttle = {
  mounted(el, binding) {
    let lastTime = 0
    const delay = Number(binding.arg) || 500 // 默认300ms

    el._throttleHandler = () => {
      const now = Date.now()
      if (now - lastTime >= delay) {
        binding.value()
        lastTime = now
      }
    }

    el.addEventListener('click', el._throttleHandler)
  },

  unmounted(el) {
    if (el._throttleHandler) {
      el.removeEventListener('click', el._throttleHandler)
      delete el._throttleHandler
    }
  }
}

/**
 * 无限滚动指令
 * 使用方法: <div v-infinite-scroll="loadMore" :distance="100">滚动加载更多</div>
 */
const infiniteScroll = {
  mounted(el, binding) {
    const callback = binding.value
    const distance = Number(el.getAttribute('distance')) || 100 // 默认100px

    const scrollHandler = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight

      // 当滚动到距离底部distance距离时触发回调
      if (scrollTop + windowHeight >= scrollHeight - distance) {
        callback()
      }
    }

    // 使用防抖优化性能
    let timer = null
    el._infiniteScrollHandler = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(scrollHandler, 100)
    }

    window.addEventListener('scroll', el._infiniteScrollHandler)
  },

  unmounted(el) {
    if (el._infiniteScrollHandler) {
      window.removeEventListener('scroll', el._infiniteScrollHandler)
      delete el._infiniteScrollHandler
    }
  }
}

// 导出所有指令
export default {
  install(app) {
    // 注册全局指令
    app.directive('lazy', lazy)
    app.directive('longpress', longpress)
    app.directive('debounce', debounce)
    app.directive('throttle', throttle)
    app.directive('infinite-scroll', infiniteScroll)
  },

  // 单独导出指令，便于按需使用
  lazy,
  longpress,
  debounce,
  throttle,
  infiniteScroll
}
