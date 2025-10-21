<script setup>
import { byComment } from '@/api/Chat'
import { loginStore } from '@/stores/counter'
import MessageNav from '@/components/messageNav.vue'

const LoginStore = loginStore()
const loadmore = async (page) => {
    return await byComment(LoginStore.userinfo.userId, page)
}

</script>
<template>
    <MessageNav @loadmore="loadmore" title="评论" nomsgTitle="您还没有作品被评论哦" nomsgDesc="赶快分享你的视频给好友吧！">
        <template #left="{ item }">
            <p>{{ item.commentContent }}</p>
            <p class="time">评论了你的评论 {{ $formatTime(item.createdAt) }}</p>
        </template>
        <template #right="{ item }">
            <img :src="item.videoCover" alt="">
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped>
img {
    width: 60px;
    height: 60px;
}

@include time;
</style>