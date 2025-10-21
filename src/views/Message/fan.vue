<script setup>
import { ref, getCurrentInstance } from 'vue'
import { getFans, triggerFollow } from '@/api/Chat'
import { loginStore } from '@/stores/counter'
import MessageNav from '@/components/messageNav.vue'

const { proxy } = getCurrentInstance()
const LoginStore = loginStore()

const loadmore = async (page) => {
    return await getFans(LoginStore.userinfo.userId, page)
}

const handleFollow = async (item) => {
    try {
        item.bothStatus = item.bothStatus === 1 ? 0 : 1
        proxy.$toast.show(item.bothStatus ? '关注成功' : '取关成功')
        await triggerFollow(LoginStore.userinfo.userId, item.userId)
    } catch (err) {
        item.bothStatus = item.bothStatus === 1 ? 0 : 1
        proxy.$toast.show(item.bothStatus ? '关注成功' : '取关成功')
        console.log(err);
    }
}
</script>
<template>
    <MessageNav @loadmore="loadmore" title="粉丝" nomsgTitle="您还没有粉丝哦" nomsgDesc="赶快互动添加好友吧">
        <template #left="{ item }">
            <p>关注了你</p>
            <p class="time">{{ $formatTime(item.createdAt) }}</p>
        </template>
        <template #right="{ item }">
            <div class="btn" @click="handleFollow(item)" :class="{ 'active': item.bothStatus }">{{ item.bothStatus ?
                '互相关注' : '关注' }}</div>
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
</style>