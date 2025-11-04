<script setup>
import { ref, onMounted } from 'vue'
import { getFans, readAllFanMsg } from '@/api/Chat'
import { loginStore } from '@/stores/counter'
import { chatStore } from '@/stores/counter'
import MessageNav from '@/components/messageNav.vue'
import Followbtn from '@/components/Followbtn.vue'
const ChatStore = chatStore()
onMounted(async () => {
    await readAllFanMsg(LoginStore.userinfo.userId)
    ChatStore.FanUnreadNumRes = 0
})
const LoginStore = loginStore()
const loadmore = async (id, page) => {
    await getFans(id, page)
    return await getFans(id, page)
}
</script>
<template>
    <MessageNav @loadmore="loadmore" title="粉丝" nomsgTitle="您还没有粉丝哦" nomsgDesc="赶快互动添加好友吧">
        <template #left="{ item }">
            <div class="newdot" v-if="!item.isRead"></div>
            <p>关注了你</p>
            <p class="time">{{ $formatTime(item.createdAt) }}</p>
        </template>
        <template #right="{ item }">
            <Followbtn :item="item" :myUserId="LoginStore.userinfo.userId"></Followbtn>
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped>
.btn {
    background-color: #f8355f;
    text-align: center;
    line-height: 25px;
    font-size: 12px;
    width: 70px;
    height: 25px;
    color: #fff;

    &.active {
        background-color: #383b44;
    }
}

@include time;
@include newdot;
</style>