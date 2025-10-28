<script setup>
import { ref, toRefs, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { searchStore } from '@/stores/counter'
const { inputvalue } = toRefs(searchStore())
const router = useRouter()
const route = useRoute()

watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    inputvalue.value = ''
  }
}, { flush: 'post' })

</script>

<template>
    <div class="search">
        <a @click="router.back()" class="iconfont icon-zuojiantou"></a>
        <div class="input">
            <span class="iconfont icon-sousuo"></span>
            <input type="text" v-model="inputvalue"
                :placeholder="`输入关键字进行搜索${route.path === 'search/video' ? '(视频描述)' : '(昵称、id)'}`">
        </div>
    </div>
    <div class="tab">
        <router-link to="/search/video">视频</router-link>
        <router-link to="/search/user">用户</router-link>
    </div>
    <div class="content">
        <router-view> </router-view>
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

        &.router-link-active {
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
