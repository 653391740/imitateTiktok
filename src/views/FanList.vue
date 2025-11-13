<script setup>
import { getFans } from '@/api/Chat'
import { loginStore } from '@/stores/counter'
import MessageNav from '@/components/messageNav.vue'
import Followbtn from '@/components/Followbtn.vue'
const store = loginStore()
const loadmore = async (uid, page, toid) => {
    return await getFans(uid, page, toid)
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
            <Followbtn defaultmyRelation="fan" :item="item" :myUserId="store.userinfo.userId"></Followbtn>
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
