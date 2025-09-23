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
    <MessageNav @loadmore="loadmore" type="赞了你你的评论" title="@我的" nomsgTitle="您还没有被@哦" nomsgDesc="赶快去@好友吧！">
        <template #right="{ item }">
            1111
        </template>
    </MessageNav>
</template>

<style lang="scss" scoped></style>