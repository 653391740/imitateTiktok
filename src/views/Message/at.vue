<script setup>
import { getAt } from '@/api/Chat'
import { loginStore } from '@/stores/counter'
import MessageNav from '@/components/messageNav.vue'

const LoginStore = loginStore()
const loadmore = async (page) => {
    return await getAt(LoginStore.userinfo.userId, page)
}

</script>
<template>
    <MessageNav @loadmore="loadmore" title="@我的" nomsgTitle="您还没有被@哦" nomsgDesc="赶快去@好友吧！">
        <template #left="{ item }">
            <p>{{ item?.commentContent || '暂无内容' }}</p>
            <p class="time">提到了你 {{ $formatTime(item.createdAt) }}</p>
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