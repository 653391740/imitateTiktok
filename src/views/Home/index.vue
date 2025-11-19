<script setup>
import Video from '@/components/video/index.vue';
import Login from '@/views/Login/login.vue';
import Register from '@/views/Login/register.vue';
import FindPassword from '@/views/Login/findPassword.vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginStore } from '@/stores/counter'
import { getPopularVideo, isLiked } from '@/api/video'

const router = useRouter()
const VideoList = ref([])
const ListoginStore = loginStore()
const toSearch = () => { router.push({ path: '/search' }) }

const getVideoList = async () => {
    try { // 获取首页视频内容
        const res = await getPopularVideo();
        const data = res.map(e => JSON.parse(e))
        VideoList.value.push(...data)
        if (!ListoginStore.userinfo.userId) {
            data.forEach(e => e.isLiked = false)
        } else {
            VideoList.value.map(async e => {
                if (!e.Video) return e
                try {
                    const likedRes = await isLiked(ListoginStore.userinfo.userId, e.Video.videoId)
                    e.isLiked = likedRes
                } catch (error) {
                    e.isLiked = false;
                }
                return e
            })
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div class="iconfont icon-sousuo"
        @click="toSearch"></div>
    <Video @pullup="getVideoList"
        :VideoList="VideoList"
        :autoPlay="true" />
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