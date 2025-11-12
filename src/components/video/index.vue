<script setup>
import { ref, defineEmits, defineExpose, nextTick, computed, onActivated, defineProps, watch, getCurrentInstance } from 'vue';
import { homeStore, commentStore } from '@/stores/counter'
import { useRoute } from 'vue-router'
import Videoitem from '@/components/video/video.vue'
import Side from '@/components/video/side-desc.vue'
import Send from '@/components/send.vue';

const { proxy } = getCurrentInstance()
const route = useRoute()
const activeIndex = ref(0); // 当前播放视频索引
const swiper = ref(null)
const video = ref(null)
const CommentStore = commentStore()
const emits = defineEmits(['pullup', 'updateactiveIndex'])
const props = defineProps({
    VideoList: {
        type: Array,
        default: () => []
    },
    autoPlay: {
        type: Boolean,
        default: false
    }
})

const HomeStore = homeStore()

watch(() => HomeStore.isLoading, (newVal) => {
    if (newVal) {
        proxy.$toast.loading(HomeStore.VideoList.length ? '加载更多视频中...' : '视频加载中...')
    } else {
        proxy.$toast.clear()
    }
})

onActivated(() => {
    nextTick(() => {
        toIndex(activeIndex.value, false)
    })
})

const handleVideoEnd = (index) => {
    activeIndex.value = index + 1;
    swiper.value.swipeTo(activeIndex.value)
}

// 切换到指定索引的视频
const toIndex = (index, smooth = true) => {
    activeIndex.value = index;
    emits('updateactiveIndex', index)
    if (swiper.value) swiper.value.swipeTo(index, smooth);
    nextTick(() => {
        if (video.value && video.value[index]) video.value[index].playPromise();
    });
}
const pausePromise = (index) => {
    video.value[index].pausePromise()
}
const newDom = ref(null)
const handleSwiperScroll = (dom) => { newDom.value = dom }

const loadMore = () => { if (route.path === '/home') HomeStore.getVideoList() }
const VideoList = computed(() => props.VideoList.map(item => item.value || item))
defineExpose({
    toIndex,
    pausePromise,
})
</script>

<template>
    <Pullupload ref="pulluploadRef" @pullup="loadMore" :newDom="newDom" :hasMore="true">
        <swipper ref="swiper" vertical :length="VideoList.length" @scroll="handleSwiperScroll" @change="toIndex">
            <div class="swipper-item" v-for="item, index in VideoList" :key="item.Video?.videoId || index">
                <Videoitem ref="video" :item="item" :activeIndex="activeIndex" :index="index" :autoPlay="props.autoPlay"
                    @ended="handleVideoEnd(index)" />
                <Side :item="item"></Side>
                <Send v-if="route.path !== '/home'"
                    @click="CommentStore.openCommentPopup(item.Video.videoId, item.WSLCNum?.commentNum || 0)">
                </Send>
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