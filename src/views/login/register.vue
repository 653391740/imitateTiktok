<script setup>
import { ref, inject } from 'vue'
import { loginStore } from '@/stores/counter'
import { register, getCode } from '@/api/login'
import { Global } from '@/stores/global'
const global = Global()
const LoginStore = loginStore()
const formData = ref({
    email: '653391740@qq.com',
    password: 'qqq111',
    code: ''
})
const asyncRegister = async () => {
    if (Object.values(formData.value).every(item => item)) {
        try {
            global.$toast.loading('注册中')
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { newUserInfo } = await register(formData.value)
            LoginStore.registerShow = false
            LoginStore.closeLogin(newUserInfo.userId)
            localStorage.setItem('tiktok_userinfo', JSON.stringify(newUserInfo))
            global.$toast.show('注册成功')
            close()
        } catch (error) {
            if (error.response.data.message === 'The email is registered.') {
                global.$toast.show('邮箱已被注册')
            }
        }
    }
}
const close = () => {
    LoginStore.registerShow = false
    formData.value = {
        email: '',
        password: '',
        code: ''
    }
}
const GetCode = async () => {
    if (!formData.value.email) return global.$toast.show('请输入邮箱')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) return global.$toast.show('请输入正确的邮箱')
    try {
        let timer = setInterval(() => {
            LoginStore.registerTime--
            if (LoginStore.registerTime <= 0) {
                clearInterval(timer)
                LoginStore.registerTime = 60
            }
        }, 1000)
        await getCode(formData.value.email)
    } catch (error) {
        global.$toast.show('获取失败')
    }
}
</script>
<template>
    <popup position="right" background="#fff" :show="LoginStore.registerShow">
        <div class="header">
            <span class="close iconfont icon-zuojiantou" @click="close"></span>
        </div>
        <form @submit.prevent>
            <h2>注册</h2>
            <input type="text" id="register-email" name="email" v-model="formData.email" required placeholder="输入邮箱">
            <input type="password" id="register-password" name="password" v-model="formData.password" required
                placeholder="输入密码">
            <div class="code">
                <input type="text" id="code" name="code" v-model="formData.code" required placeholder="输入邮箱验证码">
                <button @click="GetCode" :disabled="LoginStore.registerTime !== 60">{{
                    LoginStore.registerTime === 60 ? '获取验证码'
                        : LoginStore.registerTime }}</button>
            </div>
            <button @click="asyncRegister">注册</button>
        </form>
    </popup>
</template>

<style lang="scss" scoped>
@include login-header;
@include Register-login-style;
@include code(#F9F9F9, #F9F9F9);

.code {
    input::placeholder {
        color: #867575;
    }

    button {
        margin: 0;
        background-color: #ccc;
    }
}
</style>