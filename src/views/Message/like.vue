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
    <MessageNav @loadmore="loadmore" type="赞了你你的评论" title="点赞了你">
        <template #right="{ item }">
            {{ item.commentContent }}
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped></style>