<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import Video from '@/components/video/index.vue';
import Send from '@/components/send.vue';
import { commentStore, loginStore } from '@/stores/counter'
import { isLiked } from '@/api/video'
import { useRoute } from 'vue-router';
const { userinfo } = loginStore()
const { proxy } = getCurrentInstance()
const route = useRoute()

// 声明接收的 props，包含父组件传入的加载函数 onLoadmore
const props = defineProps({
    showDeleteIcon: {
        type: Boolean,
        default: false
    },
    onLoadmore: {
        type: Function,
        required: true
    }
})
const CommentStore = commentStore()
const page = ref(1)
const list = ref([])
const id = computed(() => route.params.id === 'me' ? userinfo.userId : route.params.id)
const loadmore = async () => {
    try {
        // 使用明确传入的 props.onLoadmore 函数（父组件通过 :onLoadmore 传入）
        const res = await props.onLoadmore(id.value, page.value)
        if (res.length === 0) return hasMore.value = false
        const formattedData = await Promise.allSettled(res.map(async e => {
            if (!e.Video) return null // Return null for items without Video
            try {
                const likedRes = await isLiked(userinfo.userId, e.Video.videoId)
                e.isLiked = likedRes
            } catch (error) {
                console.error(`获取视频 ${e.Video.videoId} 点赞状态失败:`, error);
                e.isLiked = false; // 设置默认值
            }
            return e
        }))
        // Filter out null values
        list.value.push(...formattedData.filter(item => item !== null))
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
        console.log(scrollTop, clientHeight, scrollHeight);
    })
    userinfoContainer.addEventListener('touchmove', () => {
        console.log(window.getComputedStyle(userinfoContainer).transform);
    })
})

const videoRefs = ref(null)
const activeIndex = ref(0)
const openPopup = (index) => {
    if (index >= 0 && index < list.value.length) {
        activeIndex.value = index
        showPopup.value = true
        videoRefs.value.toIndex(index, false)
    }
}
const closePopup = () => {
    showPopup.value = false
    if (videoRefs.value && activeIndex.value >= 0 && activeIndex.value < list.value.length) {
        videoRefs.value.pausePromise(activeIndex.value)
    }
}
const pulluploadRef = ref(null)
const delshow = ref(false)
const delactive = ref({})
const showDelConfirm = (item) => {
    delactive.value = item
    delshow.value = true
}
const del = async () => {
    proxy.$toast.show('暂不支持删除视频')
    delshow.value = false
}
</script>
<template>
    <Dialog ref="dialogRef" :options="{ title: '是否删除该视频' }" @close="delshow = false" @confirm="del" :show="delshow">
    </Dialog>
    <Pullupload class="pulluploadRef" ref="pulluploadRef" @pullup="loadmore" :newDom="newDom" :error="error"
        :hasMore="hasMore">
        <li v-for="item, index in list" :key="item.value.Video?.videoId || index" @click="openPopup(index)">
            <img :src="item.value.Video?.videoCover || ''">
            <div class="iconfont icon-aixin1">{{ item.value.WSLCNum?.likeNum || 0 }}</div>
            <div class="iconfont icon-lajitong" v-if="props.showDeleteIcon && route.params.id == 'me'"
                @click.stop="showDelConfirm(item.value)">
            </div>
        </li>
    </Pullupload>
    <popup class="popupRef" position="right" background="#161622" :show="showPopup">
        <div class="close iconfont icon-zuojiantou" @click="closePopup"></div>
        <Video ref="videoRefs" :VideoList="list" :autoPlay="false" @updateactiveIndex="activeIndex = $event">
            <template #default="{ item }">
                <Send @click="CommentStore.openCommentPopup(item.Video.videoId, item.WSLCNum?.commentNum || 0)">
                </Send>
            </template>
        </Video>
    </popup>
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

        .iconfont {
            color: #fff;
        }

        .icon-aixin1 {
            position: absolute;
            bottom: 0px;
            left: 5px;
        }

        .icon-lajitong {
            position: absolute;
            top: 0px;
            right: 5px;
        }

        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>