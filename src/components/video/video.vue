<script setup>
import { ref, defineEmits, watch, onMounted } from 'vue'
const video = ref(null);
const isPlaying = ref(false);

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    current: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['ended'])

onMounted(() => {
    if (props.current) playPromise();
})
const playPromise = () => {
    const playPromise = video.value.play();
    playPromise.then(() => {
        isPlaying.value = false;
    }).catch(error => {
        if (error.message.includes(`play() failed because the user didn't interact with the document first.`)) {
            isPlaying.value = true;

        }
    });
}

const togglePlayback = () => {
    const currentVideo = video.value;
    if (currentVideo.paused) {
        playPromise();
    } else {
        currentVideo.pause();
        isPlaying.value = true;
    }
}

watch(() => props.current, (newCurrent, oldCurrent) => {
    const currentVideo = video.value;
    if (newCurrent) {
        playPromise();
    } else {
        currentVideo.pause();
        currentVideo.currentTime = 0;
        isPlaying.value = false;
    }
})
</script>

<template>
    <video ref="video" :src="item.videoPath || item.Video?.videoPath"
        :poster="item.videoCover || item.Video?.videoCover" webkit-playsinline="" playsinline=""
        x5-video-player-type="h5" preload="none" :alt="item.videoId || item.Video?.videoId" @click="togglePlayback"
        @ended="emit('ended')" />
    <i class="iconfont" v-show="isPlaying">&#xe600;</i>
</template>

<style scoped lang="scss">
video {
    display: block;
    width: 100%;
    height: 100%;
}

.iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 50%;
    pointer-events: none;
}
</style>
