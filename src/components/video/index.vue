<script setup>
import { ref, onMounted, defineExpose, nextTick, onActivated } from 'vue';
import { getPopularVideo } from '@/api/video'
import Video from '@/components/video/video.vue'

const VideoList = ref([]); // 视频列表
const activeIndex = ref(0); // 当前播放视频索引
const swiper = ref(null)
const video = ref(null)


onActivated(() => {
    nextTick(() => {
        toIndex(activeIndex.value, false)
    })
})

onMounted(async () => {
    try { // 获取首页视频内容
        const res = await getPopularVideo();
        VideoList.value = res.map(e => JSON.parse(e))
    } catch (error) {
        console.log(error);
    }
})
const handleSwiperChange = (index) => {
    activeIndex.value = index;
}
const handleVideoEnd = (index) => {
    activeIndex.value = index + 1;
    swiper.value.swipeTo(activeIndex.value)
}
const toIndex = (index, smooth = true) => {
    activeIndex.value = index;
    swiper.value.swipeTo(activeIndex.value, smooth)
    console.log(video.value);
    video.value[index].playPromise();
}
defineExpose({
    toIndex
})
</script>

<template>
    <swipper ref="swiper" vertical :length="VideoList.length" @change="handleSwiperChange">
        <div class="swipper-item" v-for="item, index in VideoList" :key="item.id">
            <Video ref="video" :item="item" :activeIndex="activeIndex" :index="index" @ended="handleVideoEnd(index)" />
        </div>
    </swipper>
</template>
<style scoped lang="scss"></style>