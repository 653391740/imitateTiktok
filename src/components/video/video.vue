<script setup>
import { ref, defineEmits, watch, onMounted, inject, defineExpose, } from 'vue'
import Side from '@/components/video/side-desc.vue'
const video = ref(null);
const isPlaying = ref(false);
const toast = inject('toast')

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
    }
})
const emit = defineEmits(['ended'])

onMounted(() => {
    if (props.activeIndex === props.index) playPromise();
})

const playPromise = () => {
    if (!video.value) return
    const playPromise = video.value.play();
    playPromise.then(() => {
        isPlaying.value = false;
    }).catch(error => {
        if (error.message.includes(`play() failed because the user didn't interact with the document first.`)) {
            toast.show('由于浏览器安全策略请先点击打开声音')
            isPlaying.value = true;
        }
    });
}
defineExpose({
    playPromise
})

const togglePlayback = () => {
    const currentVideo = video.value;
    if (currentVideo.paused) {
        playPromise();
    } else {
        currentVideo.pause();
        isPlaying.value = true;
    }
}

watch(() => props.activeIndex, (newCurrentIndex, oldCurrentIndex) => {
    if (newCurrentIndex === props.index) {
        playPromise();
    } else {
        const currentVideo = video.value;
        currentVideo.pause();
        currentVideo.currentTime = 0;
        isPlaying.value = false;
    }
})
</script>

<template>
    <video ref="video" :src="item.Video.videoPath" :poster="item.videoCover || item.Video?.videoCover"
        webkit-playsinline="" playsinline="" x5-video-player-type="h5" preload="none"
        :alt="item.videoId || item.Video?.videoId" @click="togglePlayback" @ended="emit('ended')" />
    <i class="iconfont icon-bofang" v-show="isPlaying" />
    <Side :item="props.item"></Side>
</template>
<style scoped lang="scss">
video {
    display: block;
    width: 100%;
    height: 100%;
}

.iconfont {
    position: absolute;
    top: 48%;
    left: 50%;
    font-size: 45px;
    transform: translate(-50%, -50%);
    color: #eee;
    pointer-events: none;
}
</style>
