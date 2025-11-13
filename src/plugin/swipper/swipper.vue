<script setup>
import { ref, onUpdated, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({
    vertical: {
        type: Boolean,
        default: false
    },
    length: {
        type: Number,
        default: 0
    }
})
const emit = defineEmits(['change', 'scroll'])

const container = ref(null)
const activeIndex = ref(0)

// 使用单个可移除的滚动处理器，避免在每次更新时重复绑定
let scrollTimeout = null
const onScroll = () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
        scrollToIndex()
    }, 100)
}

onMounted(() => {
    if (container.value) {
        container.value.addEventListener('scroll', onScroll)
    }
})

onBeforeUnmount(() => {
    if (container.value) {
        container.value.removeEventListener('scroll', onScroll)
    }
})

onUpdated(() => {
    if (!container.value) return
    const { scrollTop, clientHeight, scrollHeight } = container.value
    const scrollInfo = { scrollTop, clientHeight, scrollHeight }
    emit('scroll', scrollInfo)
})

const swipeTo = (index, smooth = true) => {
    if (index < 0 || index >= props.length) return
    activeIndex.value = index
    const scrollPosition = props.vertical ? index * container.value.offsetHeight : index * container.value.offsetWidth
    container.value.scrollTo({
        top: props.vertical ? scrollPosition : 0,
        left: props.vertical ? 0 : scrollPosition,
        behavior: smooth ? 'smooth' : 'instant'
    })
}


defineExpose({
    swipeTo,
})
const scrollToIndex = () => {
    const scrollPosition = props.vertical ? container.value.scrollTop : container.value.scrollLeft
    const itemSize = props.vertical ? container.value.offsetHeight : container.value.offsetWidth
    const index = Math.round(scrollPosition / itemSize)
    activeIndex.value = index
    emit('change', activeIndex.value)
}
</script>
<template>
    <div class="swipper" :class="{ vertical: props.vertical }">
        <div class="swipper-container" ref="container">
            <slot></slot>
        </div>
        <div class="swipper-indicators" v-if="!props.vertical">
            <button class="indicator" v-for="(item, index) in props.length" :key="index"
                :class="{ active: index === activeIndex }"></button>
        </div>
    </div>
</template>
<style scoped lang="scss">
.swipper {
    position: relative;
    width: 100%;
    height: 50vw;
    max-width: 1000px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &.vertical {
        height: 100%;

        .swipper-container {
            flex-direction: column;
            scroll-snap-type: y mandatory;
            height: 100%;
        }
    }

    .swipper-container {
        display: flex;
        overflow: auto;
        height: 100%;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        transition: scroll 0.2s ease;

        &>* {
            flex: 0 0 100%;
            overflow: hidden;
            position: relative;
            scroll-snap-align: start;
            scroll-snap-stop: always;
        }
    }

    .swipper-indicators {
        position: absolute;
        display: flex;
        gap: 8px;
        z-index: 10;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);

        .indicator {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
            padding: 0;

            &.active {
                background-color: #ffffff;
            }
        }
    }
}
</style>
