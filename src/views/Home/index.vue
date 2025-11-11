<script setup>
import { watch, inject } from 'vue'
import Video from '@/components/video/index.vue';
import Login from '@/views/Login/login.vue';
import Register from '@/views/Login/register.vue';
import FindPassword from '@/views/Login/findPassword.vue';
import { homeStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
const HomeStore = homeStore()
const router = useRouter()
const toast = inject('toast')

const toSearch = () => {
    router.push({ path: '/search' })
}

watch(() => HomeStore.status, (newV) => {
    if (newV === 500) toast.show('无网络连接')
})
</script>

<template>
    <div class="iconfont icon-sousuo" @click="toSearch"></div>
    <Video :VideoList="HomeStore.VideoList" :autoPlay="true">
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
    z-index: 9;
    color: #fff;
}
</style>