<script setup>
import { ref, nextTick, toRefs, watch } from 'vue'
import { searchVideo } from '@/api/video'
import { commentStore, loginStore, searchStore } from '@/stores/counter'
import Video from '@/components/video/index.vue';
import Send from '@/components/send.vue';
const CommentStore = commentStore()
const LoginStore = loginStore()
const { inputvalue, searchType } = toRefs(searchStore())

const list = ref([])
const error = ref(false)
const hasMore = ref(true)
const page = ref(1)
const loading = async () => {
    try {
        if (page.value === 1 && list.value.length > 0) list.value = []
        const res = await searchVideo(LoginStore.userinfo.userId, page.value, { key: inputvalue.value })
        if (res.length === 0) return hasMore.value = false
        nextTick(() => { list.value.push(...res) })
        page.value++
    } catch (err) {
        console.log(err);
        error.value = true
    }
}
const showPopup = ref(false)
const videoRef = ref(null)
const activeIndex = ref(0)
const openPopup = (index) => {
    activeIndex.value = index
    showPopup.value = true
    nextTick(() => {
        if (videoRef.value) {
            videoRef.value.toIndex(index, false)
        } else {
            console.error('videoRef.value is null');
        }
    })
}
const closePopup = (list) => {
    console.log(list);
    showPopup.value = false
    // 添加安全检查，确保videoRef.value存在
    if (videoRef.value) {
        videoRef.value.toIndex(activeIndex.value, false)
    }
}
watch(inputvalue, (newValue, oldValue) => {
    if (newValue !== oldValue && searchType.value === 'video') {
        page.value = 1
        hasMore.value = true
        loading()
    }
}, { flush: 'post' })
</script>

<template>
    <Pullupload ref="pulluploadRef" @pullup="loading" :error="error" :hasMore="hasMore">
        <div class="list">
            <div class="item" v-for="(item, index) in list" :key="item.Video?.userId" @click="openPopup(index)"
                :style="{ backgroundImage: `url(${$imgSrc(item.Video?.videoCover)})` }">
                <div class="img"></div>
                <div class="info">
                    <div class="desc">{{ item.Video?.videoDesc }}</div>
                    <div class="userAndLike">
                        <div class="user">
                            <img v-lazy="$imgSrc(item.Video?.userAvatar)">
                            <p>{{ item.Video?.userNickname }}</p>
                        </div>
                        <div class="like iconfont icon-aixin1">{{ item.WSLCNum?.likeNum }}</div>
                    </div>
                </div>
            </div>
        </div>
        <popup class="popupRef" position="right" background="#161622" :show="showPopup">
            <div class="close iconfont icon-zuojiantou" @click="closePopup(list)"></div>
            <Video ref="videoRef" :VideoList="list" :autoPlay="false">
                <template #default="{ item }">
                    <Send @click="CommentStore.openCommentPopup(item.Video.videoId, item.WSLCNum?.commentNum || 0)">
                    </Send>
                </template>
            </Video>
        </popup>
    </Pullupload>
</template>


<style lang="scss" scoped>
.close {
    position: absolute;
    top: 10px;
    left: 15px;
    color: #fff;
    z-index: 1000;
}

.list {
    column-count: 2;
    column-gap: 0px;

    .item {
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-top: 1px solid #000;
        background-size: 100% 100%;

        &>.img {
            width: 100%;
            height: 200px;
        }
    }

    .info {
        padding: 8px;

        .desc {
            font-size: 10px;
            color: #fff;
            margin-bottom: 6px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .userAndLike {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .user {
                display: flex;
                align-items: center;

                img {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin-right: 6px;
                }

                p {
                    font-size: 12px;
                    color: #fff;
                }
            }

            .like {
                font-size: 12px;
                color: #fff;
            }
        }
    }
}
</style>