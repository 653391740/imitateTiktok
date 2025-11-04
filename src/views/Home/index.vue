<script setup>
import Video from '@/components/video/index.vue';
import Login from '@/views/Login/login.vue';
import Register from '@/views/Login/register.vue';
import FindPassword from '@/views/Login/findPassword.vue';
import { homeStore } from '@/stores/counter'
import { useRouter } from 'vue-router'

const HomeStore = homeStore()
const router = useRouter()

const toSearch = () => {
    router.push({ path: '/search' })
}
</script>

<template>
    <div class="iconfont icon-sousuo" @click="toSearch"></div>
    <Video :VideoList="HomeStore.VideoList">
        <template></template>
    </Video>
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