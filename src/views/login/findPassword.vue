<script setup>
import { ref, inject } from 'vue'
import { loginStore } from '@/stores/counter'
import { findPassword, getCode, resetPassword } from '@/api/login'
const LoginStore = loginStore()
const toast = inject('toast')

const findPasswordForm = ref({
    email: '653391740@qq.com',
    code: '',
    password: ''
})
const resetForm = () => {
    findPasswordForm.value = {
        email: '',
        code: '',
        password: ''
    }
}

const findPasswordSubmit = async () => {
    if (!Object.values(findPasswordForm.value).every(item => item)) return toast.show('请输入完整信息')
    try {
        toast.loading('重置中')
        await resetPassword(findPasswordForm.value)
        LoginStore.findPasswordShow = false
        toast.show('密码重置成功')
        resetForm()
    } catch (error) {
        if (error.response.data.message === 'code_error') return toast.show('验证码错误')
        toast.show('密码重置失败')
    }
}

const GetfindPasswordCode = async () => {
    if (!findPasswordForm.value.email) return toast.show('请输入邮箱')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(findPasswordForm.value.email)) return toast.show('请输入正确的邮箱')
    try {
        await findPassword(findPasswordForm.value.email)
        let timer = setInterval(() => {
            LoginStore.findPasswordTime--
            if (LoginStore.findPasswordTime <= 0) {
                clearInterval(timer)
                LoginStore.findPasswordTime = 60
            }
        }, 1000)
        await getCode(findPasswordForm.value.email)
    } catch (error) {
        if (error.response.data.message === 'user not found by email.') return toast.show('邮箱不存在')
        toast.show('获取验证码失败')
    }
}
</script>

<template>
    <popup position="right" background="-webkit-gradient(linear, 0% 0%, 0% 100%, from(#6b4bab), to(#bf09db))"
        :show="LoginStore.findPasswordShow">
        <div class="header">
            <span class="close iconfont icon-zuojiantou" @click="LoginStore.findPasswordShow = false"></span>
        </div>
        <form @submit.prevent>
            <h2>找回密码</h2>
            <input type="email" placeholder="输入邮箱" v-model="findPasswordForm.email">
            <div class="code">
                <input type="text" placeholder="输入验证码" v-model="findPasswordForm.code">
                <button @click="GetfindPasswordCode" :disabled="LoginStore.findPasswordTime !== 60">{{
                    LoginStore.findPasswordTime === 60 ? '获取验证码'
                        : LoginStore.findPasswordTime }}</button>
            </div>
            <input type="password" placeholder="输入新密码" v-model="findPasswordForm.password">
            <button @click="findPasswordSubmit" class="iconfont icon-tick"></button>
        </form>
    </popup>
</template>

<style lang="scss" scoped>
@include login-header;

form {
    @include position-center;
    width: 70%;
    top: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;

    @include code;

    h2 {
        color: #74a9e3;
        margin-bottom: 30px;
    }

    input {
        @include Control-style;
        width: 100%;
        background-color: #B669D6;
        margin-bottom: 10px;
        padding-left: 10px;
        color: #fff;

        &::placeholder {
            color: #C28EFD;
        }
    }

    &>button {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        color: #9D44B0;
        background-color: #D297FD;
        margin-top: 40px;
    }
}
</style>
