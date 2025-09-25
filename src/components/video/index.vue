<script setup>
import { ref, watch, onMounted } from 'vue';
import { getPopularVideo } from '@/api/video'
import Video from '@/components/video/video.vue'
import { inject } from 'vue'
const toast = inject('toast')


const VideoList = ref([]); // 视频列表
const activeIndex = ref(0); // 当前播放视频索引

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
}
</script>

<template>
    <swipper vertical @change="handleSwiperChange">
        <div class="swipper-item" v-for="item, index in VideoList" :key="item.id">
            <Video :item="item" :current="index === activeIndex" @ended="handleVideoEnd(index)" />
        </div>
    </swipper>
</template>
<style scoped lang="scss"></style>
