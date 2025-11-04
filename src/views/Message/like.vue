<script setup>
import { onMounted } from 'vue'
import { byLike, readAllByLikeMsg } from '@/api/Chat'
import MessageNav from '@/components/messageNav.vue'
import { chatStore, loginStore } from '@/stores/counter'
const ChatStore = chatStore()
const LoginStore = loginStore()
onMounted(async () => {
    await readAllByLikeMsg(LoginStore.userinfo.userId)
    ChatStore.byLikeUnreadNumRes = 0
})

const loadmore = async (uid, page) => {
    return await byLike(uid, page)
}

</script>
<template>
    <MessageNav @loadmore="loadmore" title="点赞了你" nomsgTitle="您还没有被赞哦" nomsgDesc="赶快和好友互动起来吧">
        <template #left="{ item }">
            <div class="newdot" v-if="!item.isRead"></div>
            <p>{{ item?.videoCover ? '赞了你的视频' : '赞了你的评论' }}</p>
            <p class="time">{{ $formatTime(item.createdAt) }}</p>
        </template>
        <template #right="{ item }">
            <img :src="item?.videoCover" v-if="item?.videoCover">
            <p v-else>{{ item?.commentContent }}</p>
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped>
@include time;
@include newdot;
img {
    width: 60px;
    height: 60px;
}
</style>
