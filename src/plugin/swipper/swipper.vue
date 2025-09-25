<template>
    <div class="swipper" :class="{ vertical: props.vertical }">
        <div class="swipper-container" ref="container">
            <slot></slot>
        </div>
        <div class="swipper-indicators" v-if="!props.vertical">
            <button class="indicator" v-for="(item, index) in itemCount" :key="index"
                :class="{ active: index === activeIndex }"></button>
        </div>
    </div>
</template>

<script setup>
import { ref, onUpdated, onMounted } from 'vue'

const props = defineProps({
    vertical: {
        type: Boolean,
        default: false
    },
})
const emit = defineEmits(['change'])

const container = ref(null)
const activeIndex = ref(0)
const itemCount = ref(0)
const touch = ref(false)

onMounted(() => {
    if (container.value) {
        const dom = container.value
        itemCount.value = container.value.children.length
        // 使用 scroll 事件而不是 scrollend，因为 scrollend 支持度不高
        let scrollTimeout
        dom.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                scrollToIndex()
            }, 100) // 延迟执行，确保滚动结束
        })
        dom.addEventListener('touchstart', () => touch.value = false)
        dom.addEventListener('touchend', () => touch.value = true)
    }
})
const scrollToIndex = () => {
    const scrollPosition = props.vertical ? container.value.scrollTop : container.value.scrollLeft
    const itemSize = props.vertical ? container.value.offsetHeight : container.value.offsetWidth
    const index = Math.round(scrollPosition / itemSize)
    activeIndex.value = index
    emit('change', activeIndex.value)
}
</script>
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
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        transition: scroll 0.2s ease;

        &>* {
            flex: 0 0 100%;
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
