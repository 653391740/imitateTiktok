<script setup>
import { ref, watch } from 'vue'
import { commentStore } from '@/stores/counter'
import { getVideoComment } from '@/api/video'
const CommentStore = commentStore()
const page = ref(1)
const error = ref(false)
const hasMore = ref(true)
const commentList = ref([])
const pulluploadRef = ref(null)

watch(() => CommentStore.commentId, async (newVal, oldVal) => {
    page.value = 1
    error.value = false
    hasMore.value = true
    commentList.value = []

    try {
        pulluploadRef.value.scrollToTop()
    } catch (err) {
        error.value = true
    }
})
const handleScroll = async () => {
    try {
        const newComment = await getVideoComment(CommentStore.commentId, page.value)
        if (newComment.length === 0) return hasMore.value = false
        commentList.value.push(...newComment)
        page.value++
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
                    <li v-for="item, index in commentList" :key="index">
                        <div class="avatar">
                            <img
                                :src="item.Comment.userAvatar.includes('http') ? item.Comment.userAvatar : 'http://43.138.15.137:3000' + item.Comment.userAvatar">
                        </div>
                        <div class="desc">
                            <p>@{{ item.Comment.userNickname }}</p>
                            <p style="color: #fff;">{{ item.Comment.commentContent }}</p>
                            <p style="color: #626260;">{{ item.Comment.createdAt }}</p>
                        </div>
                        <span class="iconfont icon-aixin" :data-content="item.likeNum"></span>
                    </li>
                </Pullupload>
            </div>
            <div class="send">
                <input type="text" placeholder="有爱评论,说点好听的~">
                <span class="@">@</span>
                <span class="sendBtn iconfont icon-tick"></span>
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

        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 8px;

            .avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
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