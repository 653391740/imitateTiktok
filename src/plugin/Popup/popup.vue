<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    height: {
        type: String,
        default: '100%'
    },
    background: {
        type: String,
        default: '#fff'
    },
    position: { // 弹窗出现位置
        type: String,
        default: 'right'
    },
    show: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <transition name="fade">
        <div class="popup" v-if="props.show" :style="{
            height: props.height,
            background: props.background
        }" :data-position="props.position">
            <slot></slot>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translate(0);
}

.fade-enter-from[data-position="right"],
.fade-leave-to[data-position="right"] {
    transform: translate(100%, 0);
}

.fade-enter-from[data-position="left"],
.fade-leave-to[data-position="left"] {
    transform: translate(-100%, 0);
}

.fade-enter-from[data-position="top"],
.fade-leave-to[data-position="top"] {
    transform: translate(0, -100%);
}

.fade-enter-from[data-position="bottom"],
.fade-leave-to[data-position="bottom"] {
    transform: translate(0, 100%);
}

.popup {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9;

    .popup-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
        font-size: 20px;
        color: #fff;
        background: #ccc;
        cursor: pointer;
        z-index: 10;

        &.back {
            font-size: 16px;
        }
    }
}
</style>