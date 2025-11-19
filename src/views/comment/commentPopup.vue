<script setup>
import { ref, watch, inject } from 'vue'
import { commentStore, loginStore } from '@/stores/counter'
import { getVideoComment, sendVideoComment } from '@/api/video'
import { AtUser } from '@/api/Chat'
import Send from '@/components/send.vue'
import List from './list.vue'
import Title from '@/components/title.vue'
import both from '@/components/both.vue';

const socket = inject('socket')
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
    pulluploadRef.value.scrollToTop(true)
})
const handleScroll = async () => {
    if (!CommentStore.commentId) return
    try {
        const newComment = await getVideoComment(CommentStore.commentId, page.value)
        if (newComment.length === 0) return hasMore.value = false
        if (page.value === 1) {
            commentList.value = newComment
        } else {
            commentList.value.push(...newComment)
        }
        page.value++
    } catch (err) {
        error.value = true
    }
    console.log(commentList.value);
}

const sendComment = async (content) => {
    if (!LoginStore.userinfo.userId) {
        LoginStore.loginShow = true
        CommentStore.showPopup = false
        return
    }
    if (!content) return
    try {
        const { commentId, videoId } = await sendVideoComment({
            fromUserId: LoginStore.userinfo.userId,
            replyId: CommentStore.replyId || '',
            content,
            toVideoId: CommentStore.commentId,
        })
        socket.emit('sendComment', {
            toVideoId: CommentStore.commentId,
            replyId: CommentStore.replyId || ''
        })
        page.value = 1
        handleScroll()
        if (atlist.value.length > 0) {
            atlist.value.forEach(async userIdStr => {
                await AtUser(LoginStore.userinfo.userId, {
                    userIdStr,
                    commentId,
                    videoId
                })
            });
            atlist.value = []
        }
    } catch (err) {
        error.value = true
    }
}

const sendat = () => {
    if (!LoginStore.userinfo.userId) {
        LoginStore.loginShow = true
        CommentStore.showPopup = false
        return
    }
    atShow.value = true
}
const Commentfalse = () => {
    CommentStore.showPopup = false
    send.value.commentInput = ''
}
const atlist = ref([])
const atShow = ref(false)
const selected = ({ userNickname, userId }) => {
    atShow.value = false
    send.value.addcommentInput(`@${userNickname}`)
    atlist.value.push(userId)
}
const send = ref(null)
</script>

<template>
    <popup class="commentPopupbox" @click="Commentfalse" position="bottom" background="transparent"
        :show="CommentStore.showPopup">
        <div @click.stop class="commentPopup">
            <div class="header">
                <span class="title">{{ CommentStore.commentNum }}条评论</span>
                <span class="close iconfont icon-X" @click="CommentStore.showPopup = false"></span>
            </div>
            <div class="list">
                <Pullupload ref="pulluploadRef" @pullup="handleScroll" :error="error" :hasMore="hasMore">
                    <List v-for="(item, index) in commentList" :obj="item" />
                </Pullupload>
            </div>
            <Send ref="send" @sendComment="sendComment" @sendat="sendat"></Send>
        </div>
    </popup>
    <popup class="atPopupbox" position="bottom" background="#161622" :show="atShow">
        <Title @back="atShow = false" title="@好友"></Title>
        <both @selected="selected"></both>
    </popup>
</template>

<style lang="scss" scoped>
.atPopupbox {
    z-index: 11 !important;
}

.commentPopupbox {
    z-index: 10 !important;
}

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
    padding-bottom: 50px;

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
}
</style>