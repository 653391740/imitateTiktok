<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const navItems = [
    {
        name: '首页',
        path: '/home'
    },
    {
        name: '关注',
        path: '/concern'
    },
    {
        name: null,
        path: '/updates'
    },
    {
        name: '消息',
        path: '/message'
    },
    {
        name: '我',
        path: '/user'
    }
]
</script>
<template><router-view></router-view>
<nav>
    <router-link
        v-for="(item, index) in navItems"
        :to="item.path"
        @click="activeIndex = index"
    >{{ item.name }}
        <div v-if="!item.name">
        </div>
    </router-link>
</nav>
</template>
<style lang="scss"
    scoped>
    nav {
        background-color: #000;
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;

        a {
            flex: 0 0 20%;
            line-height: 50px;
            height: 50px;
            text-align: center;
            cursor: pointer;
            color: #888;
            position: relative;

            &.router-link-active {
                color: #fff;
            }

            div {
                @include position-center;
                width: 40px;
                height: 24px;
                background-color: #fff;
                border-radius: 5px;

                &::after,
                &::before {
                    content: '';
                    @include position-center;
                    width: 8px;
                    height: 2px;
                    background-color: #000;
                }

                &::before {
                    transform: translate(-50%, -50%) rotate(90deg);
                }
            }
        }
    }
</style>
