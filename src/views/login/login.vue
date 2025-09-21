<script setup>
import { ref, inject } from 'vue'
import { loginStore } from '@/stores/counter'
import { login, getUserInfo } from '@/api/login'
import { Global } from '@/stores/global'
const global = Global()
const LoginStore = loginStore()

const formData = ref({
    email: '653391740@qq.com',
    password: 'qqqqqq'
})

const close = () => {
    LoginStore.loginShow = false
    formData.value = {
        email: '',
        password: ''
    }
}

const handleLogin = async () => {
    if (Object.values(formData.value).every(item => item)) {
        try {
            global.$toast.loading('登录中')
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { userId } = await login(formData.value)
            const res = await getUserInfo(userId)
            localStorage.setItem('tiktok_userinfo', JSON.stringify(res))
            LoginStore.closeLogin(res.userId)
            global.$toast.show('登录成功')
            close()
        } catch (error) {
            global.$toast.show('账号或密码错误')
        }
    }
}
</script>
<template>
    <popup position="bottom" background="#fff" :show="LoginStore.loginShow">
        <div class="header">
            <span class="close iconfont icon-X" @click="close"></span>
            <p @click="LoginStore.registerShow = true">注册新账号</p>
        </div>

        <form @submit.prevent="handleLogin">
            <h2>登录后即可展示自己</h2>
            <input type="text" id="login-email" name="email" v-model="formData.email" required placeholder="输入邮箱">
            <input type="password" id="login-password" name="password" v-model="formData.password" required
                placeholder="输入密码">
            <p @click="LoginStore.findPasswordShow = true">忘记了? 找回密码</p>
            <button type="submit" v-show="/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)">登录</button>
        </form>
    </popup>
</template>

<style lang="scss" scoped>
@include login-header;
@include Register-login-style;
</style>