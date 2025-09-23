<script setup>
import { ref, useAttrs, watch, defineExpose } from 'vue'
const loading = ref(false)
const pullupload = ref(null)
const attrs = useAttrs()

const handleScroll = async (newDom = pullupload.value) => {
    const { scrollTop, clientHeight, scrollHeight } = newDom
    if (!(scrollTop + clientHeight >= scrollHeight - 100)) return
    if (loading.value || !attrs.hasMore) return
    AsyncPullup()
}

watch(() => attrs.newDom?.scrollTop, () => {
    handleScroll(attrs.newDom)
})
const AsyncPullup = async () => {
    try {
        loading.value = true
        console.log('触发');
        await attrs.onPullup()
    } catch (error) {
        attrs.error = true
    } finally {
        loading.value = false
    }
}
const scrollToTop = () => {
    if (pullupload.value) {
        pullupload.value.scrollTop = 0
        AsyncPullup()
    }
}
// 暴露内部的 DOM 元素，以便父组件可以重置滚动位置
defineExpose({
    scrollToTop
})

</script>

<template>
    <div ref="pullupload" class="pullupload" v-bind="attrs" @scroll="handleScroll">
        <slot></slot>
        <!-- 加载中 -->
        <div v-if="loading" class="infinite-status">
            <i class="icon-loading"></i>
        </div>

        <!-- 异常 -->
        <div v-else-if="attrs.error" class="infinite-status">
            加载失败 <button @click="handleScroll">重试</button>
        </div>

        <!-- 到底 -->
        <div v-else-if="!attrs.hasMore" class="infinite-status">
            没有更多了
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pullupload {
    width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;

    .infinite-status {
        color: #626260;
        text-align: center;
        font-size: 12px;
        padding: 10px;

        .icon-loading {
            display: inline-block;
            width: 24px;
            height: 24px;
            margin-top: 10px;
            border: 2px solid #626260;
            border-radius: 50%;
            border-top-color: transparent;
            border-left-color: transparent;
            animation: loading-spin 0.8s linear infinite;
        }

        button {
            color: #eeeeeebe;
        }
    }
}

@keyframes loading-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>