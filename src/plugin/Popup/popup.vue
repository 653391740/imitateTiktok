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
    width: 100%;
    transition: all 0.5s;
    opacity: 0;
    z-index: 9;

    &.show {
        opacity: 1;
        left: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
    }

    &[data-position="right"] {
        left: 100%;
    }

    &[data-position="left"] {
        left: -100%;
    }

    &[data-position="top"] {
        top: -100%;
    }

    &[data-position="bottom"] {
        top: 100%;
    }
}
</style>