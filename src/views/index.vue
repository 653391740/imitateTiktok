<script setup>
import { onUpdated, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { chatStore } from '@/stores/counter'
const ChatStore = chatStore()
const route = useRoute();
const isUserPage = computed(() => {
    return route.path.includes('/user') && route.params.id && route.params.id !== 'me';
})
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
        path: '/user/me'
    }
]
</script>
<template>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view>
    <nav v-show="!isUserPage">
        <router-link v-for="(item, index) in navItems" :to="item.path" @click="activeIndex = index">{{ item.name }}
            <div v-if="!item.name" class="upfile">
            </div>
            <div v-if="index === 3 && ChatStore.dot" class="dot"></div>
        </router-link>
    </nav>
</template>
<style lang="scss" scoped>
nav {
    background-color: #000;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    border-top: 1px solid #333;

    a {
        flex: 0 0 20%;
        line-height: 50px;
        height: 50px;
        text-align: center;
        cursor: pointer;
        color: #888;
        position: relative;

        .dot {
            top: 50%;
            right: 10px;
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: red;
            border-radius: 50%;
            transform: translateY(-50%);
        }


        &.router-link-active {
            color: #fff;

            &::after {
                content: '';
                position: absolute;
                bottom: 3px;
                left: 50%;
                width: 3 0px;
                height: 2px;
                transform: translateX(-50%);
                background-color: #fff;
            }
        }

        .upfile {
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
