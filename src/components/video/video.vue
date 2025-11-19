<script setup>
import {
    ref,
    defineEmits,
    watch,
    onMounted,
    defineExpose,
    toRefs,
    getCurrentInstance,
    computed
} from 'vue'
import { useRouter } from 'vue-router'
import { triggerLike } from '@/api/video'
import { commentStore, loginStore } from '@/stores/counter'
const CommentStore = commentStore()
const LoginStore = loginStore()
const router = useRouter()
const { proxy } = getCurrentInstance()
const VideoDom = ref(null);
const videoType = ref('play');

const socket = proxy.$socket
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    activeIndex: {
        type: Number,
        default: 0
    },
    index: {
        type: Number,
        default: 0,
        required: true
    },
    autoPlay: {
        type: Boolean,
        default: false
    }
})
const { item, activeIndex, index, autoPlay } = toRefs(props)
const Video = ref(item.value.Video)
const WSLCNum = ref(item.value.WSLCNum)
const isLiked = ref(item.value.isLiked)
const emit = defineEmits(['ended'])

onMounted(() => {
    if (autoPlay.value && activeIndex.value === index.value) {
        togglePlayback();
    }
})

const togglePlayback = () => {
    if (VideoDom.value.paused) {
        playPromise();
    } else {
        pausePromise();
    }
}
const playPromise = () => {
    if (!VideoDom.value) return
    const playPromise = VideoDom.value.play();
    playPromise.then(() => {
        videoType.value = 'play';
        requestAnimationFrame(updateProgress);
        duration.value = formatDuration(VideoDom.value.duration)
    }).catch(error => {
        if (error.message.includes(`play() failed because the user didn't interact with the document first.`)) videoType.value = 'pause';
    });
}
const pausePromise = () => {
    videoType.value = 'pause';
    VideoDom.value.pause();
}
const updateProgress = () => {
    if (VideoDom.value?.duration && ProgressStartX.value == 0) {
        progressWidth.value = `${(VideoDom.value.currentTime / VideoDom.value.duration * 100).toFixed(2)}%`;
        updatateCurrentTime()
    }
    if (!VideoDom.value?.paused) {
        requestAnimationFrame(updateProgress);
    }
};
defineExpose({
    togglePlayback,
    playPromise,
    pausePromise
})
watch(() => activeIndex.value, (newCurrentIndex) => {
    if (!VideoDom.value) return;
    if (newCurrentIndex !== index.value) {
        VideoDom.value.pause();
        VideoDom.value.currentTime = 0;
        videoType.value = 'play';
    }
}, { flush: 'post', immediate: true })


const Routeruser = () => {
    if (Video.value?.userId) {
        router.push({
            name: 'user',
            params: { id: Video.value.userId }
        })
    }
}

const toggleLike = async () => {
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
}

// 长按倍数状态
const longpressType = ref(false)
// 长按快退计时器
const rewind = ref(null)
// 长按函数
const PlaybackRate = (e) => {
    longpressType.value = e.touches[0].clientX > window.innerWidth / 2;
    if (longpressType.value) {
        VideoDom.value.playbackRate = 2;
    } else {
        rewind.value = setInterval(() => VideoDom.value.currentTime -= 1, 300)
    }
}
// 长按松开
const Release = () => {
    if (longpressType.value) {
        VideoDom.value.playbackRate = 1;
    } else {
        clearInterval(rewind.value);
    }
}
// 加载进度条
const loadProgress = ref(0);
// 播放进度条
const progressWidth = ref('0%');
//  获取加载进度
const getLoadedDuration = () => {
    if (loadProgress.value === '100.00%') return;
    if (VideoDom.value && VideoDom.value.buffered.length > 0) {
        const buffered = VideoDom.value.buffered;
        const endTime = buffered.end(buffered.length - 1);
        loadProgress.value = (endTime / VideoDom.value.duration * 100).toFixed(2) + '%';
    }
}
// 从卡顿中恢复
const handlePlaying = () => {
    videoType.value = 'play';
    requestAnimationFrame(updateProgress);
}

// 进度条拖动
const Progressbar = ref(null) // 进度条元素
const ProgressStartX = ref(0) // 按下时鼠标位置
const StartWidth = ref(0) // 按下时进度条
const duration = ref('') // 视频总时长
const currentTime = ref('') // 视频当前播放时长
const updatateCurrentTime = () => { // 更新当前播放时间
    currentTime.value = formatDuration(parseFloat(progressWidth.value) * VideoDom.value.duration / 100)
}
const seekstart = (e) => { // 进度条按下
    e.preventDefault()
    ProgressStartX.value = e.touches[0].clientX
    StartWidth.value = parseFloat(progressWidth.value)
}
const seekmove = (e) => { // 进度条移动
    if (!Progressbar.value) return;
    const difX = (e.touches[0].clientX - ProgressStartX.value) / Progressbar.value.offsetWidth * 100;
    progressWidth.value = Math.max(0, Math.min(100, (difX + StartWidth.value))) + '%';
    updatateCurrentTime()
}
const seekend = (e) => { // 进度条松开
    if (!VideoDom.value.currentTime) return;
    VideoDom.value.currentTime = VideoDom.value.duration * parseFloat(progressWidth.value) / 100
    VideoDom.value.play();
    ProgressStartX.value = 0
}
const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
</script>
<template>
    <i class="iconfont icon-bofang"
        v-show="videoType == 'pause'" />
    <video v-if="item.Video?.videoPath"
        ref="VideoDom"
        :src="item.Video?.videoPath"
        v-longpress="PlaybackRate"
        @touchend="Release"
        @click="togglePlayback"
        @ended="emit('ended')"
        @progress="getLoadedDuration"
        @waiting="videoType = 'loading'"
        @playing="handlePlaying"
        :poster="item.Video?.videoCover"
        webkit-playsinline
        playsinline
        x5-video-player-type="h5"
        preload="metadata" />
    <div class="side">
        <img @click="Routeruser"
            v-lazy="$imgSrc(Video?.userAvatar)"
            alt="">
        <span v-throttle="toggleLike"
            :data-count="WSLCNum?.likeNum"
            :class="{ 'active': isLiked }"
            class="like iconfont icon-aixin"></span>
        <span @click="CommentStore.openCommentPopup(Video?.videoId, WSLCNum?.commentNum)"
            :data-count="WSLCNum?.commentNum"
            class="iconfont icon-pinglun"></span>
        <span :data-count="WSLCNum?.shareNum"
            class="iconfont icon-a-fenxiang2"></span>
    </div>
    <div class="desc"
        :style="{ opacity: ProgressStartX ? 0 : 1 }"
        @touchstart="seekstart"
        @touchmove="seekmove"
        @touchend="seekend">
        <p>@{{ Video?.userNickname }}</p>
        <p>{{ Video?.videoDesc }}</p>
    </div>
    <div class="ProgressBarTime"
        :style="{ opacity: ProgressStartX ? 1 : 0 }">
        {{ currentTime }}/{{ duration }}
    </div>
    <div class="Progressbar"
        :class="{ 'seek': ProgressStartX !== 0 }"
        ref="Progressbar">
        <!-- 已缓冲进度 -->
        <div class="loaded"
            :style="{ width: loadProgress }"></div>
        <!-- 当前进度 -->
        <div class="currentTime"
            :class="{ 'loading': videoType == 'loading', }"
            :style="{ width: progressWidth }">
        </div>
    </div>
</template>

<style scoped lang="scss">
.ProgressBarTime {
    text-align: center;
    position: absolute;
    bottom: 50px;
    width: 100%;
    height: 100px;
    color: #fff;
    font-size: 20px;
}

@keyframes loading {
    0% {
        background-position: 200%;
    }

    100% {
        background-position: -200%;
    }
}

.Progressbar {
    z-index: 9;
    width: 95%;
    height: 4px;
    border-radius: 2px;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    background-color: rgba(255, 255, 255, .2);
    transition: all .3s;
    pointer-events: none;

    &.seek {
        height: 8px !important;
        border-radius: 4px !important;

        .loaded,
        .loading,
        .currentTime {
            border-radius: 4px !important;
        }
    }

    .loaded,
    .loading,
    .currentTime {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 2px;
    }

    .loaded {
        background-color: rgba(255, 255, 255, 0.4);
    }

    .currentTime {
        background-color: rgb(40, 93, 207);
    }

    .loading {
        z-index: 10;
        animation: loading 1s linear infinite;
        background: linear-gradient(-45deg, #285dcf 0%, #fff 50%, #285dcf 100%);
        background-size: 200% 100%;
    }
}

video {
    display: block;
    width: 100%;
    height: 100%;
}

.icon-bofang {
    position: absolute;
    top: 48%;
    left: 50%;
    font-size: 45px;
    transform: translate(-50%, -50%);
    color: #eee;
    pointer-events: none;
}

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
    width: 100%;
    padding: 0 50px 10px 10px;
    color: #fff;
    position: absolute;
    left: 0;
    bottom: 50px;
    transition: all 0.3s;
    z-index: 2;

    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 5px;
    }

    p {
        margin-top: 5px;
    }
}
</style>
