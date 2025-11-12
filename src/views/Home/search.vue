<script setup>
import { ref, toRefs, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { searchStore } from '@/stores/counter'
import searchUser from './search-user.vue'
import searchVideo from './search-video.vue'

const SearchStore = searchStore()
const router = useRouter()
const route = useRoute()

</script>

<template>
    <div class="search">
        <a @click="router.back()" class="iconfont icon-zuojiantou"></a>
        <div class="input">
            <span class="iconfont icon-sousuo"></span>
            <input type="text" v-model="SearchStore.inputvalue"
                :placeholder="`输入关键字进行搜索${route.path === 'search/video' ? '(视频描述)' : '(昵称、id)'}`">
        </div>
    </div>
    <div class="tab">
        <a @touchstart="SearchStore.searchType = 'video'" :class="{ 'active': SearchStore.searchType === 'video' }">视频</a>
        <a @touchstart="SearchStore.searchType = 'user'" :class="{ 'active': SearchStore.searchType === 'user' }">用户</a>
    </div>
    <div class="content">
        <searchVideo v-show="SearchStore.searchType === 'video'"></searchVideo>
        <searchUser v-show="SearchStore.searchType === 'user'"></searchUser>
    </div>
</template>

<style lang="scss" scoped>
.content {
    height: calc(100% - 95px);
}

.tab {
    display: flex;

    a {
        flex: 1;
        text-align: center;
        font-size: 16px;
        padding: 12px;
        color: #8b8c96;

        &.active {
            color: #fff;
            border-bottom: 2px solid #face15;
        }
    }
}

.search {
    color: #fff;
    line-height: 44px;
    display: flex;

    a {
        display: block;
        width: 44px;
        height: 44px;
        line-height: 44px;
        text-align: center;
    }

    .input {
        flex: 1;
        margin-right: 10px;
        background: #242630;
        border-radius: 5px;

        span {
            margin: 0 10px;
        }

        input {
            width: 85%;
            height: 44px;
            caret-color: yellow;
            color: #fff;
        }
    }
}
</style>
