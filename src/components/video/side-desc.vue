<script setup>
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { triggerLike } from '@/api/video'
import { commentStore, loginStore } from '@/stores/counter'
const CommentStore = commentStore()
const LoginStore = loginStore()
const router = useRouter()
const loading = ref(false)

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})

const Routeruser = () => {
    router.push({
        path: '/user',
        query: { userId: props.item.Video.userId }
    })
}

const toggleLike = async () => {
    if (!LoginStore.userId) return LoginStore.loginShow = true
    if (loading.value) return
    loading.value = true
    try {
        const msg = await triggerLike(LoginStore.userId, props.item.Video.videoId)
        if (msg === '喜欢成功') {
            props.item.WSLCNum.likeNum++
            props.item.WSLCNum.isLike = true
        } else {
            props.item.WSLCNum.likeNum--
            props.item.WSLCNum.isLike = false
        }
    } catch (error) {
        console.log(error);
    } finally {
        setTimeout(() => loading.value = false, 300)
    }
}

const openCommentPopup = () => {
    if (!LoginStore.userId) return LoginStore.loginShow = true
    CommentStore.showPopup = true
    CommentStore.commentNum = props.item.WSLCNum.commentNum
    CommentStore.commentId = props.item.Video.videoId
}
</script>

<template>
    <div class="side">
        <img @click="Routeruser" :src="$imgSrc(props.item.Video.userAvatar)" alt="">
        <span @click="toggleLike" :data-count="props.item.WSLCNum.likeNum"
            :class="{ 'active': props.item.WSLCNum.isLike }" class="like iconfont icon-aixin"></span>
        <span @click="openCommentPopup" :data-count="props.item.WSLCNum.commentNum"
            class="iconfont icon-pinglun"></span>
        <span :data-count="props.item.WSLCNum.shareNum" class="iconfont icon-a-fenxiang2"></span>
    </div>
    <div class="desc">
        <p>@{{ props.item.Video.userNickname }}</p>
        <p>{{ props.item.Video.videoDesc }}</p>
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