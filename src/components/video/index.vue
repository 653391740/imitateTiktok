<script setup>
import { ref, onMounted, defineExpose, nextTick, onActivated, defineProps } from 'vue';
import Video from '@/components/video/video.vue'
import Side from '@/components/video/side-desc.vue'
import CommentPopup from '@/components/comment/commentPopup.vue'
const activeIndex = ref(0); // 当前播放视频索引
const swiper = ref(null)
const video = ref(null)

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
defineExpose({
    toIndex
})
</script>

<template>
    <swipper ref="swiper" vertical :length="props.VideoList.length" @change="handleSwiperChange">
        <div class="swipper-item" v-for="item, index in props.VideoList" :key="item.id">
            <Video ref="video" :item="item" :activeIndex="activeIndex" :index="index" @ended="handleVideoEnd(index)" />
            <Side :item="item"></Side>
        </div>
    </swipper>
    <CommentPopup></CommentPopup>
</template>
<style scoped lang="scss">
.swipper-item {
    padding-bottom: 50px;
    background-color: #000;
}
</style>