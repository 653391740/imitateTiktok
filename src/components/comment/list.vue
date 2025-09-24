<script setup>
import { ref, defineProps, toRefs, getCurrentInstance } from 'vue'
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
props.obj.isLiked = false

// 解构 obj 对象，获取 Comment 和 likeNum
const { Comment, likeNum, isLiked } = toRefs(props.obj)

const handleLikeComment = proxy.$throttle(async () => {
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
})

</script>
<template>
    <li>
        <div class="avatar">
            <img :src="$imgSrc(Comment.userAvatar)">
        </div>
        <div class="desc">
            <p>@{{ Comment.userNickname }}</p>
            <p style="color: #fff;">{{ Comment.commentContent }}</p>
            <p style="color: #626260;">{{ $formatTime(Comment.createdAt) }}</p>
        </div>
        <span class="iconfont icon-aixin" :data-content="likeNum" @click="handleLikeComment"
            :class="{ 'active': isLiked }"></span>
    </li>
</template>

<style lang="scss" scoped>
li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;

    .avatar {
        width: 40px;
        height: 40px;
        clip-path: circle(50% at 50% 50%);
    }

    .desc {
        flex: 1;
        font-size: 12px;
        color: #a6a5a4;
        border-bottom: 1px solid rgba(41, 40, 37, 0.8);
        margin: 0 10px;
        padding: 8px 0;
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
            bottom: -20px;
            font-size: 12px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>