<script setup>
import { ref, defineProps } from 'vue'
import { commentStore } from '@/stores/counter'
const CommentStore = commentStore()
const props = defineProps({
    obj: {
        type: Object,
        default: () => ({})
    }
})

</script>
<template>
    <li>
        <div class="avatar">
            <img :src="$imgSrc(props.obj.Comment.userAvatar)">
        </div>
        <div class="desc">
            <p>@{{ props.obj.Comment.userNickname }}</p>
            <p style="color: #fff;">{{ props.obj.Comment.commentContent }}</p>
            <p style="color: #626260;">{{ $formatTime(props.obj.Comment.createdAt) }}</p>
        </div>
        <span class="iconfont icon-aixin" :data-content="props.obj.likeNum"></span>
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