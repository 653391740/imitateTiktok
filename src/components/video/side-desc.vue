<script setup>
import { ref, defineProps } from 'vue'
import { commentStore, loginStore } from '@/stores/counter'
const CommentStore = commentStore()
const LoginStore = loginStore()

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})

const openCommentPopup = () => {
    if (!LoginStore.isLogin) return LoginStore.loginShow = true
    CommentStore.showPopup = true
}
</script>

<template>
    <div class="side">
        <img :src="'http://43.138.15.137:3000' + props.item.Video.userAvatar || 'http://43.138.15.137:3000/assets/avatar/default.png'"
            alt="">
        <span @click="qq" :data-count="props.item.WSLCNum.likeNum" class="like iconfont icon-aixin"></span>
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