<script setup>
import Title from '@/components/title.vue'
import Content from '@/views/Message/index-list.vue'
import { useRouter } from 'vue-router'
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
                </li>
                <li @click="router.push('/like')">
                    <div style="background-color: #f8355f;" class="iconfont icon-aixin1"></div>
                    <p>赞</p>
                </li>
                <li @click="router.push('/at')">
                    <div style="background-color: #1cc262;">@</div>
                    <p>@我的</p>
                </li>
                <li @click="router.push('/comment')">
                    <div style="background-color: #a753ec;" class="iconfont icon-pinglun"></div>
                    <p>评论</p>
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
    padding-top: 44px;
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

                div {
                    width: 40px;
                    line-height: 40px;
                }

                p {
                    font-size: 12px;
                    margin-top: 5px;
                }
            }
        }
    }
}
</style>