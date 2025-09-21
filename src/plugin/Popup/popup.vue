<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    message: {
        type: String,
        default: ''
    },
    backType: {
        type: Boolean,
        default: true // true是x  false是<
    },
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
    <div class="popup" :class="{ 'show': props.show }" :style="{
        height: props.height,
        background: props.background
    }" :data-position="props.position">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transition: all 0.5s;
    opacity: 0;
    z-index: 101;

    &.show {
        opacity: 1;
        transform: translate(0) !important;
    }

    &[data-position="right"] {
        transform: translateX(100%);
    }

    &[data-position="left"] {
        transform: translateX(-100%);
    }

    &[data-position="top"] {
        transform: translateY(-100%);
    }

    &[data-position="bottom"] {
        transform: translateY(100%);
        top: unset;
        bottom: 0;
    }
}
</style>