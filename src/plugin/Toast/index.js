import { createApp, h } from 'vue'
import MsgComponent from './msg.vue'

// 创建消息组件实例
let msgInstance = null
let mountNode = null

// 创建挂载节点
const createMountNode = () => {
    if (!mountNode) {
        mountNode = document.createElement('div')
        document.body.appendChild(mountNode)
    }
    return mountNode
}

// 创建消息实例
const createMsgInstance = () => {
    if (!msgInstance) {
        const mountNode = createMountNode()
        const app = createApp({
            render() {
                return h(MsgComponent, {
                    ref: 'msg'
                })
            }
        })
        msgInstance = app.mount(mountNode)
    }
    return msgInstance.$refs.msg
}

// Toast 方法集合
const Toast = {
    // 显示普通文本消息
    show(message, duration = 2000) {
        const instance = createMsgInstance()
        instance.setType('text')
        instance.show(message, duration)
        return instance
    },

    // 显示加载消息
    loading(message = '加载中...', duration = 0) {
        const instance = createMsgInstance()
        instance.setType('loading')
        instance.show(message, duration)
        return instance
    },

    // 清除消息
    clear() {
        const instance = createMsgInstance()
        instance.clear()
        return instance
    }
}

// 安装插件
const install = (app) => {
    // 全局挂载 $toast 方法
    app.config.globalProperties.$toast = Toast

    // 提供全局注入
    app.provide('toast', Toast)
}

export default install
export { Toast }