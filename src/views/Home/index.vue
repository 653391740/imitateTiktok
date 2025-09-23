<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import Video from '@/components/video/index.vue';
import Login from '@/views/Login/login.vue';
import Register from '@/views/Login/register.vue';
import FindPassword from '@/views/Login/findPassword.vue';
import { loginStore, homeStore } from '@/stores/counter'
const { proxy } = getCurrentInstance()
const LoginStore = loginStore()
const HomeStore = homeStore()
LoginStore.Login(proxy)

onMounted(() => {
    HomeStore.getVideoList()
})
</script>

<template>
    <div class="iconfont icon-sousuo" />
    <Video :VideoList="HomeStore.VideoList"></Video>
    <Login></Login>
    <Register></Register>
    <FindPassword></FindPassword>
</template>

<style scoped lang="scss">
.iconfont {
    position: fixed;
    right: 20px;
    top: 20px;
    font-size: 20px;
    z-index: 99;
    color: #fff;
}
</style>