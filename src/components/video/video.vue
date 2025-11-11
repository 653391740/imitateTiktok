<script setup>
import { ref, defineEmits, watch, onMounted, defineExpose, toRefs, nextTick } from 'vue'
const VideoDom = ref(null);
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
        default: false
    }
})
const { item, activeIndex, index, autoPlay } = toRefs(props)

const emit = defineEmits(['ended'])


onMounted(() => {
    if (autoPlay.value && activeIndex.value === index.value) {
        togglePlayback();
    }
})

const playPromise = () => {
    if (!VideoDom.value) return
    const playPromise = VideoDom.value.play();
    playPromise.then(() => {
        isPlaying.value = false;
    }).catch(error => {
        if (error.message.includes(`play() failed because the user didn't interact with the document first.`)) isPlaying.value = true;
    });
}
const pausePromise = () => {
    isPlaying.value = true;
    VideoDom.value.pause();
}


const togglePlayback = () => {
    if (VideoDom.value.paused) {
        playPromise();
    } else {
        pausePromise();
    }
}

defineExpose({
    togglePlayback,
    playPromise,
    pausePromise
})

watch(() => activeIndex.value, (newCurrentIndex, oldCurrentIndex) => {
    if (!VideoDom.value) return;
    if (newCurrentIndex !== index.value) {
        VideoDom.value.pause();
        VideoDom.value.currentTime = 0;
        isPlaying.value = false;
    }
}, { flush: 'post', immediate: true }) 
</script>
<template>
    <video v-if="item.Video?.videoPath" ref="VideoDom" :src="item.Video?.videoPath" :poster="item.Video?.videoCover"
        @click="togglePlayback" @ended="emit('ended')" webkit-playsinline playsinline x5-video-player-type="h5"
        preload="metadata" />
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
