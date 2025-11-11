import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/global.scss'
import plugins from '@/plugin/index.js'
import filters from '@/plugin/filters.js'
import SocketIO from './plugin/io.js'


const app = createApp(App)

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  app.config.globalProperties[`$${key}`] = filters[key]
})

// 注册全局组件
Object.values(plugins).forEach(plugin => {
  app.use(plugin)
})
app.use(SocketIO, { // 应用
  connection: 'http://43.138.15.137:3000', // socket服务地址
})
app.use(createPinia())
app.use(router)
app.mount('#app')