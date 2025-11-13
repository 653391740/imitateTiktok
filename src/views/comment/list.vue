<script setup>
import { ref, defineProps, getCurrentInstance, watch } from 'vue'
import { commentStore, loginStore } from '@/stores/counter'
import { triggerLikeComment } from '@/api/video'
const { proxy } = getCurrentInstance()
const CommentStore = commentStore()
const LoginStore = loginStore()
const props = defineProps({
    obj: {
        type: Object,
        default: () => ({})
    }
})
const likeNum = ref(props.obj.likeNum || 0)
const Comment = ref(props.obj.Comment || {})
const isLiked = ref(props.obj.isLiked || false)

watch(() => props.obj, (newObj) => {
    likeNum.value = newObj?.likeNum || 0
    Comment.value = newObj?.Comment || {}
    isLiked.value = newObj?.isLiked || false
}, { deep: true })

const handleLikeComment = async () => {
    if (!LoginStore.userinfo.userId) {
        LoginStore.loginShow = true
        CommentStore.showPopup = false
        return
    }
    try {
        const msg = await triggerLikeComment(LoginStore.userinfo.userId, CommentStore.commentId, Comment.value.commentId)
        if (msg === '喜欢评论成功') {
            isLiked.value = true
            likeNum.value++
        } else {
            isLiked.value = false
            likeNum.value--
        }
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <li>
        <div class="avatar">
            <img v-lazy="$imgSrc(Comment.userAvatar)">
        </div>
        <div class="desc">
            <p>@{{ Comment.userNickname }}</p>
            <p class="comment">{{ Comment.commentContent }}</p>
            <p style="color: #626260;">{{ $formatTime(Comment.createdAt) }}</p>
        </div>
        <span class="iconfont icon-aixin" :data-content="likeNum" v-throttle="handleLikeComment"
            :class="{ 'active': isLiked }"></span>
    </li>
</template>

<style lang="scss" scoped>
li {
    display: flex;
    justify-content: space-between;
    padding: 8px 8px 0;

    .avatar {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        clip-path: circle(50% at 50% 50%);
    }

    .desc {
        width: calc(100% - 100px);
        font-size: 12px;
        color: #a6a5a4;
        border-bottom: 1px solid rgba(41, 40, 37, 0.8);
        margin-left: 10px;
        padding-bottom: 8px;

        .comment {
            color: #fff;
            word-break: break-all;
        }
    }

    &>span {
        color: #87878A;
        position: relative;

        &.active {
            color: #FF4D4F;
        }

        &::after {
            content: attr(data-content);
            position: absolute;
            top: 20px;
            font-size: 12px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>