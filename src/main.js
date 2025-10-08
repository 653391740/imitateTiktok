import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.scss'
import plugins from '@/plugin/index.js'
import { event } from '@/hooks/event.js'

const app = createApp(App)

// Install all plugins
Object.values(plugins).forEach(plugin => {
  app.use(plugin)
})

app.use(router)
app.mount('#app')