<script setup>
import { ref, defineEmits, defineExpose, nextTick, onActivated, defineProps } from 'vue';
import { useRoute } from 'vue-router'
import Video from '@/components/video/video.vue'
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
    }
})

onActivated(() => {
    nextTick(() => {
        toIndex(activeIndex.value, false)
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
    swiper.value.swipeTo(index, smooth)
    video.value[index].playPromise();
}

const newDom = ref(null)
const handleSwiperScroll = (dom) => {
    newDom.value = dom
}
const HomeStore = homeStore()
const loadMore = () => {
    if (route.path === '/home') HomeStore.getVideoList()
}
defineExpose({
    toIndex
})
</script>

<template>
    <Pullupload ref="pulluploadRef" @pullup="loadMore" :newDom="newDom" :hasMore="true">
        <swipper ref="swiper" vertical :length="props.VideoList.length" @scroll="handleSwiperScroll"
            @change="handleSwiperChange">
            <div class="swipper-item" v-for="item, index in props.VideoList" :key="item.id">
                <Video ref="video" :item="item.value" :activeIndex="activeIndex" :index="index"
                    @ended="handleVideoEnd(index)" />
                <Side :item="item.value"></Side>
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