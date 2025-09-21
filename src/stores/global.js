import { getCurrentInstance } from 'vue'

// 导出一个函数，在组件内部调用时获取全局属性
export const Global = () => {
  const instance = getCurrentInstance()
  if (!instance) {
    console.warn('getCurrentInstance must be called within setup or lifecycle hooks')
    return {}
  }
  return instance.appContext.config.globalProperties
}

// 导出一个默认对象，用于向后兼容
export default {
  install(app) {
    app.config.globalProperties.$global = app.config.globalProperties
  }
}