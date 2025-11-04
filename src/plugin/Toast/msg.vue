<script setup>
import { ref, computed } from 'vue'
const isShow = ref(false)
const timer = ref(null)
const message = ref('')
const type = ref('text') // text, success, fail, loading

// 根据类型计算样式
const msgClass = computed(() => {
    return {
        'msg': true,
        [`msg-${type.value}`]: true
    }
})

const show = (msg, duration = 2000) => {
    message.value = msg
    isShow.value = true

    // 清除之前的定时器
    if (timer.value) clearTimeout(timer.value)

    // 如果 duration > 0，设置定时器自动关闭
    if (duration > 0) {
        timer.value = setTimeout(() => {
            isShow.value = false
        }, duration)
    }
}

// 清除消息
const clear = () => {
    isShow.value = false
    if (timer.value) clearTimeout(timer.value)
}

// 设置消息类型
const setType = (newType) => {
    type.value = newType
}

// 暴露方法给外部使用
defineExpose({
    show,
    clear,
    setType,
})
</script>
<template>
    <transition name="fade">
        <div :class="msgClass" v-if="isShow">
            <div class="msg-icon" v-if="type !== 'text'">
                <i v-if="type === 'loading'" class="icon-loading"></i>
            </div>
            <div class="msg-text">{{ message }}</div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    max-width: 70%;
    padding: 16px;
    position: fixed;
    top: 60%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    pointer-events: none;

    &.msg-loading {
        background-color: rgba(0, 0, 0, 0.7);
    }
}

.msg-icon {
    font-size: 24px;

    .icon-loading {
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 2px solid #fff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: loading-spin 0.8s linear infinite;
    }
}

.msg-text {
    text-align: center;
    line-height: 1.4;
}

@keyframes loading-spin {
    to {
        transform: rotate(360deg);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>