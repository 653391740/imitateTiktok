<script setup>
import { onMounted } from 'vue'
import { getAt ,readAllAt} from '@/api/Chat'
import MessageNav from '@/components/messageNav.vue'
import { chatStore, loginStore } from '@/stores/counter'
const ChatStore = chatStore()
const LoginStore = loginStore()
onMounted(async () => {
    await readAllAt(LoginStore.userinfo.userId)
    ChatStore.getAtUnreadNumRes = 0
})
const loadmore = async (uid, page) => {
    return await getAt(uid, page)
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