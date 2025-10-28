<script setup>
import { defineProps } from 'vue'
const emit = defineEmits(['close', 'confirm'])
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    options: {
        type: Object,
        default: () => ({
            title: '',
            msg: ''
        })
    }
})
</script>

<template>
    <transition name="fade">
        <div class="dialog" v-if="props.show">
            <div class="box">
                <div class="title">{{ props.options.title || '提示' }}
                    <p v-if="props.options.msg">{{ props.options.msg }}</p>
                </div>
                <div class="btn">
                    <span @click="emit('close')">取消</span>
                    <span @click="emit('confirm')">确定</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-from .box,
.fade-leave-to .box {
    transform: translateX(-50%) scale(0.3);
}

.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.1);
    z-index: 999;

    .box {
        top: 35%;
        left: 50%;
        width: 270px;
        position: absolute;
        border-radius: 16px;
        transform: translateX(-50%);
        background-color: rgba(22, 24, 35, 0.98);
        overflow: hidden;
        text-align: center;

        .title {
            color: rgba(255, 255, 255, 0.5);
            padding: 20px;
            border-bottom: $bordB;
        }

        p {
            margin-top: 10px;
            font-size: 14px;
            color: #646566;
        }

        .btn {
            display: flex;

            span {
                flex: 1;
                text-align: center;
                line-height: 48px;
                margin: 0 -.5px;
                color: rgba(255, 255, 255, 0.3);
            }
        }
    }
}
</style>