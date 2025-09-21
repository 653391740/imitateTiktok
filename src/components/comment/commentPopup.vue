<script setup>
import { ref, watch } from 'vue'
import { commentStore, loginStore } from '@/stores/counter'
import { getVideoComment, sendVideoComment } from '@/api/video'
import List from './list.vue'

const CommentStore = commentStore()
const LoginStore = loginStore()
const commentList = ref([])
const pulluploadRef = ref(null)

const page = ref(1)
const error = ref(false)
const hasMore = ref(true)

watch(() => CommentStore.commentId, async (newVal, oldVal) => {
    page.value = 1
    error.value = false
    hasMore.value = true
    commentList.value = []
    AsyncScrollToTop()
})
const AsyncScrollToTop = () => {
    try {
        pulluploadRef.value.scrollToTop()
    } catch (err) {
        error.value = true
    }
}
const handleScroll = async () => {
    try {
        const newComment = await getVideoComment(CommentStore.commentId, page.value)
        if (newComment.length === 0) return hasMore.value = false
        if (page.value === 1 && commentList.value.length > 0) {
            const CommentData = newComment.filter(item => item.Comment.userId !== LoginStore.userId)
            const myComment = newComment.filter(item => item.Comment.userId === LoginStore.userId)
            commentList.value = [...myComment, ...CommentData]
        } else {
            commentList.value.push(...newComment)
        }
        page.value++
    } catch (err) {
        error.value = true
    }
}
const commentInput = ref('')
const sendComment = async () => {
    if (!commentInput.value) return
    try {
        await sendVideoComment({
            fromUserId: LoginStore.userId,
            replyId: CommentStore.replyId || '',
            content: commentInput.value,
            toVideoId: CommentStore.commentId,
        })
        commentInput.value = ''
        page.value = 1
        AsyncScrollToTop()
    } catch (err) {
        error.value = true
    }
}
</script>

<template>
    <popup @click="CommentStore.showPopup = false" position="bottom" background="transparent"
        :show="CommentStore.showPopup">
        <div @click.stop class="commentPopup">
            <div class="header">
                <span class="title">{{ CommentStore.commentNum }}条评论</span>
                <span class="close iconfont icon-X" @click="CommentStore.showPopup = false"></span>
            </div>
            <div class="list">
                <Pullupload ref="pulluploadRef" @pullup="handleScroll" :error="error" :hasMore="hasMore">
                    <List v-for="item, index in commentList" :key="index" :obj="item" />
                </Pullupload>
            </div>
            <div class="send">
                <input type="text" placeholder="有爱评论,说点好听的~" v-model.trim="commentInput">
                <span class="@">@</span>
                <span class="sendBtn iconfont icon-tick" @click="sendComment"></span>
            </div>
        </div>
    </popup>
</template>

<style lang="scss" scoped>
.commentPopup {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 65vh;
    background: rgba(22, 24, 35, 0.98);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .header {
        color: #626260;
        padding: 8px;
        text-align: center;
        font-size: 12px;

        .close {
            float: right;
        }
    }

    .list {
        flex: 1;
        overflow: hidden;
    }

    .send {
        height: 44px;
        display: flex;
        background-color: #31333B;

        input {
            flex: 1;
            padding-left: 10px;
            color: #fff;
        }



        span {
            width: 44px;
            line-height: 44px;
            text-align: center;
            color: #fff;
        }
    }
}
</style>