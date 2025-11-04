<script setup>
import { ref } from 'vue'
import { chatStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
const ChatStore = chatStore()
const router = useRouter()

// 记录每个列表项的滑动状态
const slideStates = ref({})

// 触摸开始位置
const startX = ref(0)
// 当前触摸的元素
const currentTouchItem = ref(null)

// 触摸开始
const handleTouchStart = (event, userId) => {
    startX.value = event.touches[0].clientX
    currentTouchItem.value = userId
}

// 触摸移动
const handleTouchMove = (event, userId) => {
    if (!currentTouchItem.value || currentTouchItem.value !== userId) return
    const currentX = event.touches[0].clientX
    const diffX = startX.value - currentX
    if (diffX > 30) {
        slideStates.value[userId] = true
    } else {
        slideStates.value[userId] = false
    }
}

// 清除所有滑动状态
const clearStatus = () => {
    Object.keys(slideStates.value).forEach(key => {
        if (currentTouchItem.value === null) return slideStates.value[key] = false
        if (key !== currentTouchItem.value.toString()) slideStates.value[key] = false
    })
}

// 触摸结束
const handleTouchEnd = (event, userId) => {
    currentTouchItem.value = null
}

// 删除聊天记录
const deleteChatItem = (userId) => {
    ChatStore.deleteChat(userId)
    delete slideStates.value[userId]
}

const toRouterchat = (item) => {
    router.push({ path: 'chatWith', query: { ...item.info } })
}
</script>

<template>
    <div class="message-content">
        <ul v-if="ChatStore.chatList.length > 0" @touchstart="clearStatus">
            <li v-for="item in ChatStore.chatList" :key="item.info.userId"
                :class="{ 'slide-active': slideStates[item.info.userId] }"
                @touchstart="handleTouchStart($event, item.info.userId)"
                @touchmove.prevent="handleTouchMove($event, item.info.userId)"
                @touchend="handleTouchEnd($event, item.info.userId)" @click="toRouterchat(item)">
                <img :src="$imgSrc(item.info.userAvatar)" alt="">
                <div class="info">
                    <p class="user-name">{{ item.info.userNickname }}</p>
                    <p class="time">{{ $formatTime2(item.info.createdAt) }}</p>
                </div>
                <div class="newMsg">{{ item.info.content }}</div>
                <div class="delete-btn" @click.stop="deleteChatItem(item.info.userId)">删除</div>
            </li>
        </ul>
        <img v-else class="no-message" src="/src/assets/0.jpg">
    </div>
</template>

<style lang="scss" scoped>
.message-content {
    flex: 1;
    position: relative;

    ul {
        height: 100%;
        overflow: hidden;

        li {
            padding: 0 10px;
            margin-top: 10px;
            position: relative;
            transition: all 0.3s ease-in-out;

            &.slide-active {
                transform: translateX(-80px);
            }

            .delete-btn {
                content: '删除';
                position: absolute;
                right: -80px;
                top: 0;
                display: block;
                clear: both;
                background-color: red;
                color: #fff;
                width: 80px;
                line-height: 50px;
                text-align: center;
            }

            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
                float: left;
            }

            .info {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .user-name {
                    color: #fff;
                }

                .time {
                    font-size: 12px;
                    color: #65676e;
                }
            }

            .newMsg {
                margin-top: 5px;
                color: #8b8c96;
                font-size: 10px;
            }
        }
    }

    .no-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>