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
        default: true
    }
})
const { item, activeIndex, index, autoPlay } = toRefs(props)
const emit = defineEmits(['ended'])


onMounted(() => {
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


const togglePlayback = () => {
    console.log('VideoDom.value:', VideoDom.value);
    console.log('item.Video?.videoPath:', item.value?.Video?.videoPath);

    if (!VideoDom.value) {
        console.error('VideoDom is null');
        return;
    }

    if (!VideoDom.value.src) {
        console.error('video src is empty');
        return;
    }

    if (VideoDom.value.paused) {
        playPromise();
    } else {
        VideoDom.value.pause();
        isPlaying.value = true;
    }
}

defineExpose({
    togglePlayback
})

watch(() => activeIndex.value, (newCurrentIndex, oldCurrentIndex) => {
    if (!VideoDom.value) return;

    if (newCurrentIndex === index.value) {
        // 当组件首次挂载且是当前活动视频时，或者当索引改变时
        if (oldCurrentIndex === undefined || oldCurrentIndex !== newCurrentIndex) {
            if (autoPlay.value) {
                nextTick(() => {
                    playPromise();
                });
            }
        }
    } else {
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
