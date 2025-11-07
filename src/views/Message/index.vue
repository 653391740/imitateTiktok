<script setup>
import Title from '@/components/title.vue'
import Content from '@/views/Message/index-list.vue'
import { useRouter } from 'vue-router'
import { chatStore } from '@/stores/counter'
const ChatStore = chatStore()
const router = useRouter()

</script>
<template>
    <div class="message">
        <Title title="消息" msg="联系人" @click="router.push('/contact')"></Title>
        <nav class="message-header">
            <ul>
                <li @click="router.push('/fan')">
                    <div style="background-color: #4f88fb;" class="iconfont icon-fensishu"></div>
                    <p>粉丝</p>
                    <p class="count" v-if="ChatStore.FanUnreadNumRes">{{ChatStore.FanUnreadNumRes }}</p>
                </li>
                <li @click="router.push('/like')">
                    <div style="background-color: #f8355f;" class="iconfont icon-aixin1"></div>
                    <p>赞</p>
                    <p class="count" v-if="ChatStore.byLikeUnreadNumRes">{{ChatStore.byLikeUnreadNumRes }}</p>    
                </li>
                <li @click="router.push('/at')">
                    <div style="background-color: #1cc262;">@</div>
                    <p>@我的</p>
                    <p class="count" v-if="ChatStore.getAtUnreadNumRes">{{ChatStore.getAtUnreadNumRes }}</p>
                </li>
                <li @click="router.push('/comment')">
                    <div style="background-color: #a753ec;" class="iconfont icon-pinglun"></div>
                    <p>评论</p>
                    <p class="count" v-if="ChatStore.byCommentUnreadNumRes">{{ChatStore.byCommentUnreadNumRes }}</p>
                </li>
            </ul>
        </nav>
        <Content></Content>
    </div>
</template>
<style lang="scss" scoped>
.message {
    height: 100vh;
    overflow: hidden;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;

    .message-header {
        color: #fff;

        ul {
            margin: 10px;
            padding-bottom: 15px;
            display: flex;
            justify-content: space-around;
            border-bottom: $bordB;

            li {
                text-align: center;
                position: relative;

                div {
                    width: 40px;
                    line-height: 40px;
                }

                p {
                    font-size: 12px;
                    margin-top: 5px;
                }
                .count {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background-color: red;
                    color: #fff;
                    font-size: 10px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    border-radius: 10px;
                }
            }
        }
    }
}
</style>