<script setup>
import { ref, defineEmits, defineExpose, nextTick, computed, onActivated, defineProps } from 'vue';
import { useRoute } from 'vue-router'
import Videoitem from '@/components/video/video.vue'
import Side from '@/components/video/side-desc.vue'
import { homeStore } from '@/stores/counter'

const route = useRoute()
const activeIndex = ref(0); // 当前播放视频索引
const swiper = ref(null)
const video = ref(null)

const emits = defineEmits(['pullup'])
const props = defineProps({
    VideoList: {
        type: Array,
        default: () => []
    },
    autoPlay: {
        type: Boolean,
        default: true
    }
})
onActivated(() => {
    nextTick(() => {
        toIndex(activeIndex.value, false)
        console.log(VideoList.value);
    })
})

const handleSwiperChange = (index) => {
    activeIndex.value = index;
}
const handleVideoEnd = (index) => {
    activeIndex.value = index + 1;
    swiper.value.swipeTo(activeIndex.value)
}

// 切换到指定索引的视频
const toIndex = (index, smooth = true) => {
    activeIndex.value = index;
    if (swiper.value) {
        swiper.value.swipeTo(index, smooth);
    }
    // 使用nextTick确保DOM更新完成后再调用togglePlayback
    nextTick(() => {
        if (video.value && video.value[index]) {
            video.value[index].togglePlayback();
        }
    });
}

const newDom = ref(null)
const handleSwiperScroll = (dom) => {
    newDom.value = dom
}
const HomeStore = homeStore()
const loadMore = () => {
    if (route.path === '/home') HomeStore.getVideoList()
}
const VideoList = computed(() => props.VideoList.map(item => item.value || item))
defineExpose({
    toIndex
})
</script>

<template>
    <Pullupload ref="pulluploadRef" @pullup="loadMore" :newDom="newDom" :hasMore="true">
        <swipper ref="swiper" vertical :length="VideoList.length" @scroll="handleSwiperScroll"
            @change="handleSwiperChange">
            <div class="swipper-item" v-for="item, index in VideoList" :key="item.Video?.videoId || index">
                <Videoitem ref="video" :item="item" :activeIndex="activeIndex" :index="index" :autoPlay="props.autoPlay"
                    @ended="handleVideoEnd(index)" />
                <Side :item="item"></Side>
                <slot :item="item"></slot>
            </div>
        </swipper>
    </Pullupload>
</template>
<style scoped lang="scss">
.swipper-item {
    padding-bottom: 50px;
    background-color: #000;
}
</style>