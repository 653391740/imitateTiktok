<script setup>
import { onMounted } from 'vue'
import { getFans } from '@/api/Chat'
import MessageNav from '@/components/messageNav.vue'
import { chatStore, loginStore } from '@/stores/counter'
const ChatStore = chatStore()
const LoginStore = loginStore()

const loadmore = async (uid, page) => {
    return await getFans(uid, page)
}

</script>
<template>
    <MessageNav @loadmore="loadmore" title="我的粉丝" nomsgTitle="您还没有粉丝哦" nomsgDesc="赶快和网友互动起来吧">
        <template #left="{ item }">
            <div class="newdot" v-if="!item.isRead"></div>
            <p>{{ item?.videoCover ? '赞了你的视频' : '赞了你的评论' }}</p>
            <p class="time">{{ $formatTime(item.createdAt) }}</p>
        </template>
        <template #right="{ item }">
            <img v-lazy="item?.videoCover" v-if="item?.videoCover">
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
