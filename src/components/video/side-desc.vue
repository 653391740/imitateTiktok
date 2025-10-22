<script setup>
import { ref, defineProps, getCurrentInstance, toRefs } from 'vue'
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
const { Video, WSLCNum, isLiked } = toRefs(props.item)

const Routeruser = () => {
    router.push({
        path: '/user',
        query: { userId: Video.value.userId }
    })
}

const toggleLike = proxy.$throttle(async () => {
    if (!LoginStore.userinfo.userId) return LoginStore.loginShow = true
    try {
        const msg = await triggerLike(LoginStore.userinfo.userId, Video.value.videoId)
        console.log(props.item);
        
        if (msg === '喜欢成功') {
            WSLCNum.value.likeNum++
            isLiked.value = true
        } else {
            WSLCNum.value.likeNum--
            isLiked.value = false
        }
    } catch (error) {
        console.log(error);
    }
})

 
</script>

<template>
    <div class="side">
        <img @click="Routeruser" :src="proxy.$imgSrc(Video.userAvatar)" alt="">
        <span @click="toggleLike" :data-count="WSLCNum.likeNum" :class="{ 'active': isLiked }"
            class="like iconfont icon-aixin"></span>
        <span @click="CommentStore.openCommentPopup(Video.videoId, WSLCNum.commentNum)" :data-count="WSLCNum.commentNum"
            class="iconfont icon-pinglun"></span>
        <span :data-count="WSLCNum.shareNum" class="iconfont icon-a-fenxiang2"></span>
    </div>
    <div class="desc">
        <p>@{{ Video.userNickname }}</p>
        <p>{{ Video.videoDesc }}</p>
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