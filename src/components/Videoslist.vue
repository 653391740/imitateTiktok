<script setup>
import Video from '@/components/video/index.vue';
import Send from '@/components/send.vue';
import { commentStore } from '@/stores/counter'
import { ref, onMounted, useAttrs } from 'vue'
import { loginStore } from '@/stores/counter';
import { isLiked } from '@/api/video'
const { userinfo } = loginStore()

const attrs = useAttrs()
const CommentStore = commentStore()
const page = ref(1)
const list = ref([])

const loadmore = async () => {
    try {
        const res = await attrs.onLoadmore(userinfo.userId, page.value)
        if (res.length === 0) return hasMore.value = false
        const formattedData = await Promise.allSettled(res.map(async e => {
            if (!e.Video) return e
            try {
                const likedRes = await isLiked(userinfo.userId, e.Video.videoId)
                e.isLiked = likedRes
            } catch (error) {
                console.error(`获取视频 ${e.Video.videoId} 点赞状态失败:`, error);
                e.isLiked = false; // 设置默认值
            }
            return e
        }))
        list.value.push(...formattedData)
        page.value++
        error.value = false
    } catch (err) {
        console.log(err);
        error.value = true
    }
}

const error = ref(false)
const hasMore = ref(true)
const showPopup = ref(false)
const newDom = ref({})
onMounted(() => {
    const userinfoContainer = document.querySelector('.userinfo-container')
    userinfoContainer.addEventListener('scroll', () => {
        const { scrollTop, clientHeight, scrollHeight } = userinfoContainer
        newDom.value = { scrollTop, clientHeight, scrollHeight }
    })
})

const videoRef = ref(null)
const activeIndex = ref(0)
const openPopup = (index) => {
    console.log(1);
    
    activeIndex.value = index
    showPopup.value = true
    videoRef.value.toIndex(index, false)
}
const closePopup = () => {
    showPopup.value = false
    videoRef.value.toIndex(activeIndex.value, false)
}
</script>
<template>
    <Pullupload class="pulluploadRef" ref="pulluploadRef" @pullup="loadmore" :newDom="newDom" :error="error"
        :hasMore="hasMore">
        <li v-for="item, index in list" :key="item.value.Video.videoId" @click="openPopup(index)">
            <img :src="item.value.Video.videoCover">
        </li>
    </Pullupload>
    <teleport to="body">
        <popup class="popupRef" position="right" background="#161622" :show="showPopup">
            <div class="close iconfont icon-zuojiantou" @click="closePopup"></div>
            <Video ref="videoRef" :VideoList="list" :autoPlay="false">
                <template #default="{ item }">
                    <Send @click="CommentStore.openCommentPopup(item.Video.videoId, item.WSLCNum.commentNum)"></Send>
                </template>
            </Video>
        </popup>
    </teleport>
</template>

<style lang="scss" scoped>
.close {
    position: absolute;
    top: 10px;
    left: 15px;
    color: #fff;
    z-index: 1000;
}

.pulluploadRef {
    height: fit-content;
    display: flex;
    flex-wrap: wrap;

    li {
        background-color: $backcolor;
        list-style: none;
        flex: 0 0 33.33%;
        border: 0.5px solid #000;
        height: 163px;
        position: relative;

        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>