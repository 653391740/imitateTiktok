<script setup>
import { ref } from 'vue'

const list = ref([])
</script>

<template>
    <div class="message-content">
        <div class="list" v-if="list.length > 0">
            <ul>
                <li>
                    <img src="">
                    <div class="info">
                        <p class="user-name">用户</p>
                        <p class="time">2023-01-01 12:00:00</p>
                    </div>
                    <div class="newMsg">2222</div>
                </li>
            </ul>
        </div>
        <img v-else class="no-message" src="/src/assets/0.jpg">
    </div>
</template>

<style lang="scss" scoped>
.message-content {
    flex: 1;
    position: relative;

    .list {
        height: 100%;
        overflow: auto;

        li {
            padding: 0 10px;
            margin-top: 10px;

            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
                float: left;
            }

            .info {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .user-name {
                    color: #fff;
                }

                .time {
                    font-size: 12px;
                    color: #65676e;
                }
            }

            .newMsg {
                margin-top: 5px;
                color: #8b8c96;
                font-size: 10px;
            }
        }
    }

    .no-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>