import io from 'socket.io-client'
export default {
    install: (app, { connection, options }) => {
        var socket = io(connection, options) // io的参数
        app.config.globalProperties.$socket = socket // 全局属性
        app.provide('socket', socket) // 依赖注入
    }
}