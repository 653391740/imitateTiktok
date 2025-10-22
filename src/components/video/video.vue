<script setup>
import { ref, defineEmits, watch, onMounted, defineExpose, toRefs } from 'vue'
const videodemo = ref(null);
const isPlaying = ref(false);

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
        default: true
    }
})
const { item, activeIndex, index, autoPlay } = toRefs(props)
const emit = defineEmits(['ended'])

onMounted(() => {
    if (activeIndex.value === index.value && autoPlay.value) playPromise();
})

const playPromise = () => {
    if (!videodemo.value) return
    const playPromise = videodemo.value.play();
    playPromise.then(() => {
        isPlaying.value = false;
    }).catch(error => {
        if (error.message.includes(`play() failed because the user didn't interact with the document first.`)) isPlaying.value = true;
    });
}

const togglePlayback = () => {
    if (videodemo.value.paused) {
        playPromise();
    } else {
        videodemo.value.pause();
        isPlaying.value = true;
    }
}

defineExpose({
    togglePlayback
})

watch(() => activeIndex.value, (newCurrentIndex, oldCurrentIndex) => {
    if (newCurrentIndex === index.value) {
        playPromise();
    } else {
        videodemo.value.pause();
        videodemo.value.currentTime = 0;
        isPlaying.value = false;
    }
})
</script>

<template>
    <video ref="videodemo" :src="item.Video.videoPath" :poster="item.Video.videoCover" @click="togglePlayback"
        @ended="emit('ended')" webkit-playsinline="" playsinline="" x5-video-player-type="h5" preload="none" />
    <i class="iconfont icon-bofang" v-show="isPlaying" />
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
