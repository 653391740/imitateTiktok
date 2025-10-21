<script setup>
import { byLike } from '@/api/Chat'
import { loginStore } from '@/stores/counter'
import MessageNav from '@/components/messageNav.vue'

const LoginStore = loginStore()

const loadmore = async () => {
    return await byLike(LoginStore.userinfo.userId)
}

</script>
<template>
    <MessageNav @loadmore="loadmore" title="点赞了你" nomsgTitle="您还没有被赞哦" nomsgDesc="赶快和好友互动起来吧">
        <template #left="{ item }">
            <p>赞了你的评论</p>
            <p class="time">{{ $formatTime(item.createdAt) }}</p>
        </template>
        <template #right="{ item }">
            {{ item.commentContent }}
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped>
@include time;
</style>
