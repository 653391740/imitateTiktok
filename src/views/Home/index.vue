<script setup>
import Video from '@/components/video/index.vue';
import Login from '@/views/Login/login.vue';
import Register from '@/views/Login/register.vue';
import FindPassword from '@/views/Login/findPassword.vue';
import { homeStore } from '@/stores/counter'
const HomeStore = homeStore()

</script>

<template>
    <div class="iconfont icon-sousuo"></div>
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