<script setup>
import { ref, defineProps, getCurrentInstance, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { triggerLike } from '@/api/video'
import { commentStore, loginStore } from '@/stores/counter'
const CommentStore = commentStore()
const LoginStore = loginStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})

// 创建本地响应式副本来避免直接修改props
const localItem = reactive({
    Video: { ...props.item.Video },
    WSLCNum: { ...props.item.WSLCNum },
    isLiked: props.item.isLiked || false
});

// 监听 props.item 的变化，更新本地副本
watch(() => props.item, (newItem) => {
    // 只在 props.item 变化时才更新 localItem
    localItem.Video = { ...newItem.Video };
    localItem.WSLCNum = { ...newItem.WSLCNum };
    localItem.isLiked = newItem.isLiked || false;
}, { deep: true });


// 使用computed来响应式地获取嵌套属性
const Video = computed(() => localItem.Video || {})
const WSLCNum = computed(() => localItem.WSLCNum || {})
const isLiked = computed(() => localItem.isLiked || false)

const Routeruser = () => {
    if (Video.value?.userId) {
        router.push({
            path: '/user',
            query: { userId: Video.value.userId }
        })
    }
}

const toggleLike = proxy.$throttle(async () => {
    if (!LoginStore.userinfo.userId) return LoginStore.loginShow = true
    if (!Video.value?.videoId) return

    try {
        const msg = await triggerLike(LoginStore.userinfo.userId, Video.value.videoId)
        console.log(props.item);

        if (msg === '喜欢成功') {
            // 修改本地副本而不是props
            WSLCNum.value.likeNum = (WSLCNum.value.likeNum || 0) + 1
            localItem.isLiked = true
        } else {
            WSLCNum.value.likeNum = Math.max((WSLCNum.value.likeNum || 0) - 1, 0)
            localItem.isLiked = false
        }
    } catch (error) {
        console.log(error);
    }
})


</script>

<template>
    <div class="side">
        <img @click="Routeruser" :src="proxy.$imgSrc(Video?.userAvatar)" alt="">
        <span @click="toggleLike" :data-count="WSLCNum?.likeNum" :class="{ 'active': isLiked }"
            class="like iconfont icon-aixin"></span>
        <span @click="CommentStore.openCommentPopup(Video?.videoId, WSLCNum?.commentNum)"
            :data-count="WSLCNum?.commentNum" class="iconfont icon-pinglun"></span>
        <span :data-count="WSLCNum?.shareNum" class="iconfont icon-a-fenxiang2"></span>
    </div>
    <div class="desc">
        <p>@{{ Video?.userNickname }}</p>
        <p>{{ Video?.videoDesc }}</p>
    </div>
</template>

<style lang="scss" scoped>
.side {
    position: absolute;
    right: 10px;
    bottom: 90px;
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;

    img {
        border-radius: 50%;
        border: 1px solid #fff;
    }

    span {
        position: relative;
        font-size: 30px;
        color: #eee;

        &::after {
            content: attr(data-count);
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #fff;
        }
    }

    .like {
        transition: all 0.3s ease;

        &.active {
            color: red;
        }
    }
}

.desc {
    width: 80%;
    color: #fff;
    position: absolute;
    left: 10px;
    bottom: 60px;

    p {
        margin-top: 5px;
    }
}
</style>