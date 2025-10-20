<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
    title: {
        type: String,
        default: '标题'
    },
    msg: {
        type: String,
        default: ''
    },
    back: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['click'])
</script>
<template>
    <div class="title">
        <span v-if="back" class="back iconfont icon-zuojiantou" @click="router.back()"></span>
        <p>{{ title }}</p>
        <div class="msg" @click="emits('click')">{{ msg }}</div>
    </div>
</template>

<style lang="scss" scoped>
.title {
    line-height: 44px;
    font-size: 15px;
    color: #fff;
    text-align: center;
    border-bottom: $bordB;
    background-color: #161622;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    .back,
    .msg {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 15px;
    }

    .back {
        left: 10px;
    }
    .msg {
        right: 10px;
    }
}
</style>