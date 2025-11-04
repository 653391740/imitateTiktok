<script setup>
import { ref, defineProps, toRefs,getCurrentInstance } from 'vue'
import { loginStore, commentStore } from '@/stores/counter'
import { triggerLike } from '@/api/video'
const { proxy } = getCurrentInstance()
const socket = proxy.$socket
const LoginStore = loginStore()
const CommentStore = commentStore()
const props = defineProps({
    obj: {
        type: Object,
        default: () => ({})
    }
})
const { Video, WSLCNum, isLiked } = toRefs(props.obj)

const handleLike = async () => {
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
}
const videoRef = ref(null)
const playVideo = () => {
    if (videoRef.value.paused) {
        videoRef.value.play()
    } else {
        videoRef.value.pause()
    }
}
</script>

<template>
    <div class="video-item">
        <img :src="$imgSrc(Video.userAvatar)" alt="">
        <span class="nickname">@{{ Video.userNickname }}</span>
        <p class="desc">{{ Video.videoDesc }}</p>
        <video ref="videoRef" :src="Video.videoPath" :poster="Video.videoCover" @click="playVideo()"></video>
        <span @click="handleLike()" class="iconfont icon-aixin" :class="{ 'active': isLiked }"
            :data-count="WSLCNum.likeNum"></span>
        <span @click="CommentStore.openCommentPopup(Video.videoId, WSLCNum.commentNum)" class="iconfont icon-pinglun"
            :data-count="WSLCNum.commentNum"></span>
        <span class="iconfont icon-a-fenxiang2" :data-count="WSLCNum.shareNum"></span>
        <p class="time">{{ $formatTime(Video.createdAt) }}</p>
    </div>
</template>

<style lang="scss" scoped>
.video-item {
    margin: 10px;
    padding-bottom: 20px;
    color: #fff;
    border-bottom: 1px solid rgba(41, 40, 37, 0.8);


    .icon-aixin.active {
        color: #f00;
    }

    &:nth-last-child(2) {
        margin-bottom: 0;
    }

    img {
        width: 30px;
        border-radius: 50%;
        margin-right: 7px;
    }

    .nickname {
        font-size: 14px;
    }

    span {
        margin-right: 40px;
        position: relative;
        font-size: 26px;

        &::after {
            content: attr(data-count);
            position: absolute;
            top: 50%;
            right: -15px;
            font-size: 10px;
            color: #fff;
            transform: translateY(-50%);
        }
    }

    .desc {
        line-height: 1.2;
        margin: 10px 0;
    }

    .time {
        font-size: 10px;
        color: #626260;
    }

    video {
        width: 70%;
        height: 400px;
        display: block;
        background-color: #000;
        border-radius: 5px;
        margin-bottom: 5px;
    }
}
</style>