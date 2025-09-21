<script setup>
import { ref, onMounted } from 'vue';
import Video from '@/components/video/index.vue';
import Login from '@/views/login/login.vue';
import Register from '@/views/login/register.vue';
import FindPassword from '@/views/login/findPassword.vue';

import { getPopularVideo } from '@/api/video'

const VideoList = ref([]); // 视频列表
onMounted(async () => {
    try { // 获取首页视频内容
        const res = await getPopularVideo();
        VideoList.value = res.map(e => JSON.parse(e))
    } catch (error) {
        console.log(error);
    }
})
</script>

<template>
    <div class="iconfont icon-sousuo" />
    <Video :VideoList="VideoList"></Video>
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