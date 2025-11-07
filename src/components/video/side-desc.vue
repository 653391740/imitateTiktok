<script setup>
import { ref, defineProps, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { triggerLike } from '@/api/video'
import { commentStore, loginStore } from '@/stores/counter'
const CommentStore = commentStore()
const LoginStore = loginStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const socket = proxy.$socket
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})
const Video = ref(props.item.Video || {})
const WSLCNum = ref(props.item.WSLCNum || {})
const isLiked = ref(props.item.isLiked || false)

const Routeruser = () => {
    if (Video.value?.userId) {
        router.push({
            name: 'user',
            params: { id: Video.value.userId }
        })
    }
}

const toggleLike = proxy.$throttle(async () => {
    if (!LoginStore.userinfo.userId) return LoginStore.loginShow = true
    if (!Video.value?.videoId) return
    try {
        isLiked.value = !isLiked.value
        isLiked.value ? WSLCNum.value.likeNum++ : WSLCNum.value.likeNum--
        await triggerLike(LoginStore.userinfo.userId, Video.value.videoId)
        socket.emit('sendTriggerLike', {
            toUserId: Video.value.userId
        })
    } catch (error) {
        console.log(error);
        isLiked.value = !isLiked.value
        isLiked.value ? WSLCNum.value.likeNum++ : WSLCNum.value.likeNum--
    }
})


</script>

<template>
    <div class="side">
        <img @click="Routeruser" :src="proxy.$imgSrc(Video?.userAvatar)" alt="">
        <span @click="toggleLike" :data-count="WSLCNum?.likeNum" :class="{ 'active': isLiked }"
            class="like iconfont icon-aixin"></span>
        <span @click="CommentStore.openCommentPopup(Video?.videoId, WSLCNum?.commentNum)"
            :data-count="WSLCNum?.commentNum" class="iconfont icon-pinglun"></span>
        <span :data-count="WSLCNum?.shareNum" class="iconfont icon-a-fenxiang2"></span>
    </div>
    <div class="desc">
        <p>@{{ Video?.userNickname }}</p>
        <p>{{ Video?.videoDesc }}</p>
    </div>
</template>

<style lang="scss" scoped>
.side {
    position: absolute;
    right: 10px;
    bottom: 90px;
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;

    img {
        border-radius: 50%;
        border: 1px solid #fff;
    }

    span {
        position: relative;
        font-size: 30px;
        color: #eee;

        &::after {
            content: attr(data-count);
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #fff;
        }
    }

    .like {
        transition: all 0.3s ease;

        &.active {
            color: red;
        }
    }
}

.desc {
    width: 80%;
    color: #fff;
    position: absolute;
    left: 10px;
    bottom: 60px;

    p {
        margin-top: 5px;
    }
}
</style>