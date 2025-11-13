<script setup>
import MessageNav from '@/components/messageNav.vue'
import Followbtn from '@/components/Followbtn.vue'
import { Followers } from '@/api/Chat'
import { loginStore } from '@/stores/counter'
const LoginStore = loginStore()
const loadmore = async (uid, page, toid) => {
    return await Followers(uid, page, toid)
}

</script>
<template>
    <MessageNav @loadmore="loadmore" title="我关注的" nomsgTitle="您还没有关注任何人" nomsgDesc="赶快关注您感兴趣的人吧">
        <template #left="{ item }">
            <p>{{ item?.userDesc }}</p>
        </template>
        <template #right="{ item }">
            <Followbtn defaultmyRelation="follow" :item="item" :myUserId="LoginStore.userinfo.userId" :qf="true">
            </Followbtn>
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped>
@include newdot;

img {
    width: 60px;
    height: 60px;
}
</style>
