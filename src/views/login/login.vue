<script setup>
import { ref,  getCurrentInstance } from 'vue'
import { loginStore } from '@/stores/counter'
const { proxy } = getCurrentInstance()
const LoginStore = loginStore()

const handleLogin = async () => {
    if (Object.values(LoginStore.formData).every(item => item)) {
        LoginStore.Login(proxy)
    } else {
        proxy.$toast.show('请输入账号密码')
    }
}

const close = () => {
    LoginStore.loginShow = false
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
            <input type="text" id="login-email" name="email" v-model="LoginStore.formData.email" required
                placeholder="输入邮箱">
            <input type="password" id="login-password" name="password" v-model="LoginStore.formData.password" required
                placeholder="输入密码">
            <p @click="LoginStore.findPasswordShow = true">忘记了? 找回密码</p>
            <button type="submit" v-show="/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(LoginStore.formData.email)">登录</button>
        </form>
    </popup>
</template>

<style lang="scss" scoped>
@include login-header;
@include Register-login-style;
</style>