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
    <MessageNav @loadmore="loadmore" type="赞了你你的评论" title="@我的" nomsgTitle="您还没有作品被评论哦" nomsgDesc="赶快分享你的视频给好友吧！">
        <template #right="{ item }">
            {{ item.commentContent }}
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped></style>