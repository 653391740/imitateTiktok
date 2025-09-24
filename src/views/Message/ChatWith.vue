<script setup>
import Title from '@/components/title.vue'
import Send from '@/components/send.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPrivateLetter, readPrivateLetter, sendPrivateLetter } from '@/api/Chat'
import { loginStore } from '@/stores/counter'

const LoginStore = loginStore()
const route = useRoute()

const letterList = ref([])
onMounted(async () => {
    letterList.value = await getPrivateLetter(LoginStore.userinfo.userId, route.query.userId)
    await readPrivateLetter(LoginStore.userinfo.userId, route.query.userId)
    console.log(letterList.value);
})

const sendComment = async (content) => {
    await sendPrivateLetter(LoginStore.userinfo.userId, route.query.userId, {
        content,
        fromUserId: LoginStore.userinfo.userId,
        toUserId: route.query.userId
    })
}
</script>

<template>
    <Title :title="route.query.userNickname" back></Title>
    <ul>
        <li v-for="item, index in letterList" :key="index"
            :class="item.fromId !== LoginStore.userinfo.userId ? 'right' : 'left'">
            <div class="msg">{{ item.privateLetterContent }}</div>
            <img :src="$imgSrc(item.fromId === LoginStore.userinfo.userId ? LoginStore.userinfo.userAvatar : route.query.userAvatar)"
                alt="">
        </li>
    </ul>
    <Send class="send" @sendComment="sendComment" msg="发送消息..."></Send>
</template>

<style lang="scss" scoped>
ul {
    padding: 44px 0;
    height: 100vh;
    overflow: auto;
    color: #fff;

    li {
        margin: 20px 0;
        display: flex;
        justify-content: flex-end;

        &.left {
            width: 100%;
            flex-direction: row-reverse;
            margin-right: 50px;
        }

        &.right {
            margin-left: 50px;
        }

        .msg {
            padding: 10px 15px;
            border-radius: 7px;
            background-color: #fff;
            color: #000;
            display: inline-block;
        }

        img {
            width: 40px;
            margin: 0 20px;
            border-radius: 50%;
        }
    }
}

.send {
    background-color: #161622 !important;
    border-top: $bordB;
}
</style>