<script setup>
import Title from '@/components/title.vue'
import Send from '@/components/send.vue'
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getPrivateLetter, readPrivateLetter, sendPrivateLetter } from '@/api/Chat'
import { loginStore, chatStore } from '@/stores/counter'

const LoginStore = loginStore()
const ChatStore = chatStore()
const route = useRoute()

const letterList = ref([])
const chatContainer = ref(null)

// 滚动到底部的函数
const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
    })
}

onMounted(async () => {
    letterList.value = await getPrivateLetter(LoginStore.userinfo.userId, route.query.userId)
    await readPrivateLetter(LoginStore.userinfo.userId, route.query.userId)
    // 数据加载完成后滚动到底部
    scrollToBottom()
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
    // 如果当前时间的分钟数在上一条消息的分钟数加10内，那么就认为是在同一十分钟内
}

const sendComment = async (content) => {
    const { updatedAt, version, id, ...item } = await sendPrivateLetter(LoginStore.userinfo.userId, route.query.userId, {
        content,
        fromUserId: LoginStore.userinfo.userId,
        toUserId: route.query.userId
    })
    letterList.value.push({ ...item, isRead: 0 })
    const createdAt = new Date().getTime()
    ChatStore.addChat({
        ...route.query,
        content,
        createdAt
    })
    // 发送消息后滚动到底部
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
            <div class="content" :class="item.fromId === LoginStore.userinfo.userId ? 'right' : 'left'">
                <div class="msg">{{ item.privateLetterContent }}</div>
                <img
                    :src="$imgSrc(item.fromId === LoginStore.userinfo.userId ? LoginStore.userinfo.userAvatar : route.query.userAvatar)">
            </div>
        </li>
    </ul>
    <Send class="send" @sendComment="sendComment" msg="发送消息..." />
</template>

<style lang="scss" scoped>
ul {
    padding-top: 44px;
    height: calc(100vh - 44px);
    overflow: auto;
    color: #fff;
    border-bottom: $bordB;

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
                display: inline-block;
            }

            img {
                width: 40px;
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