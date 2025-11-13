<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { chatStore } from '@/stores/counter'
const ChatStore = chatStore()
const route = useRoute();
const isUserPage = computed(() => {
    return ['InterestList', 'FanList'].includes(route.name)
        || (route.path.includes('/user') && route.params?.id !== 'me')
        || route.path.includes('/search');
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
        <keep-alive exclude="User">
            <component :is="Component" />
        </keep-alive>
    </router-view>
    <nav v-show="!isUserPage">
        <router-link v-for="(item, index) in navItems" :to="item.path" @click="activeIndex = index">
            <p>{{ item.name }}</p>
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
    height: 50px;

    a {
        flex: 0 0 20%;
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

        p {
            width: fit-content;
            margin: 0 auto;
            padding: 5px 0;
            border-bottom: 2px solid transparent;
        }

        &.router-link-active {
            color: #fff;

            p {
                border-color: #fff
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
