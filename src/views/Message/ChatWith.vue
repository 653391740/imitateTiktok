<script setup>
import Title from '@/components/title.vue'
import Send from '@/components/send.vue'
import { ref, inject, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getPrivateLetter, readPrivateLetter, sendPrivateLetter } from '@/api/Chat'
import { loginStore, chatStore } from '@/stores/counter'
const { userinfo } = loginStore()
const ChatStore = chatStore()
const route = useRoute()
const socket = inject("socket");
socket.on('receivePrivateLetter', data => {
    const { content, ...item } = data
    letterList.value.push({ ...item, privateLetterContent: content })
    scrollToBottom()
})
const letterList = ref([])
const chatContainer = ref(null)

const scrollToBottom = () => {
    nextTick(() => chatContainer.value.scrollTop = chatContainer.value.scrollHeight)
}

onMounted(async () => {
    letterList.value = await getPrivateLetter(userinfo.userId, route.query.userId)
    scrollToBottom()
    await readPrivateLetter(userinfo.userId, route.query.userId)
})

// 判断是否与上一条消息在同一十分钟内
const isSameTenMinuteAsPrevious = (index) => {
    if (index === 0) return false
    const current = letterList.value[index]
    const previous = letterList.value[index - 1]

    if (!current.createdAt || !previous.createdAt) return false

    const currentDate = new Date(current.createdAt)
    const previousDate = new Date(previous.createdAt)

    return currentDate.getFullYear() === previousDate.getFullYear() &&
        currentDate.getMonth() === previousDate.getMonth() &&
        currentDate.getDate() === previousDate.getDate() &&
        currentDate.getHours() === previousDate.getHours() &&
        currentDate.getMinutes() <= previousDate.getMinutes() + 10
}

const sendComment = async (content) => {
    const { updatedAt, version, id, ...item } = await sendPrivateLetter(userinfo.userId, route.query.userId, {
        content,
        fromUserId: userinfo.userId,
        toUserId: route.query.userId
    })
    let obj = {
        fromId: userinfo.userId,
        toId: route.query.userId,
        content,
        createdAt: new Date().getTime(),
        userAvatar: userinfo.userAvatar,
        userNickname: userinfo.userNickname
    }
    socket.emit('sendPrivateLetter', obj);
    letterList.value.push({ ...item, isRead: 0 })
    const createdAt = new Date().getTime()
    ChatStore.addChat({
        ...route.query,
        content,
        createdAt
    })
    scrollToBottom()
}
</script>

<template>
    <Title :title="route.query.userNickname" back />
    <ul ref="chatContainer">
        <li v-for="item, index in letterList" :key="index">
            <!-- 只在第一条消息或者与上一条消息不在同一十分钟内显示时间 -->
            <div v-if="!isSameTenMinuteAsPrevious(index)" class="time">
                {{ $formatTime2(item.createdAt) }}
            </div>
            <div class="content" :class="item.fromId === userinfo.userId ? 'right' : 'left'">
                <div class="msg">{{ item.privateLetterContent }}</div>
                <img :src="$imgSrc(item.fromId === userinfo.userId ? userinfo.userAvatar : route.query.userAvatar)">
            </div>
        </li>
    </ul>
    <Send class="send" @sendComment="sendComment" msg="发送消息..." />
</template>

<style lang="scss" scoped>
ul {
    padding-top: 44px;
    height: calc(100vh - 44px);
    overflow-y: auto;
    color: #fff;
    border-bottom: $bordB;
    scrollbar-width: 0;

    li {
        margin: 20px 0;
        text-align: center;

        .time {
            font-size: 10px;
            margin-bottom: 20px;
        }

        .content {
            display: flex;
            justify-content: flex-end;

            &.left {
                flex-direction: row-reverse;
                padding-right: 50px;
            }

            &.right {
                padding-left: 50px;
            }

            .msg {
                padding: 10px 15px;
                border-radius: 7px;
                background-color: #fff;
                color: #000;
                text-align: left;
            }

            img {
                width: 40px;
                height: 40px;
                margin: 0 20px;
                border-radius: 50%;
            }
        }
    }
}

.send {
    background-color: #161622 !important;
}
</style>