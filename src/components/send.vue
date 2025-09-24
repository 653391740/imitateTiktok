<script setup>
import { ref, defineEmits, defineProps } from 'vue'
const emit = defineEmits(['sendComment'])
const props = defineProps({
    msg: {
        type: String,
        default: '有爱评论,说点好听的~'
    }
})
const commentInput = ref('')
const send = () => {
    emit('sendComment', commentInput.value)
    commentInput.value = ''
}
</script>
<template>
    <div class="send" :style="{ backgroundColor: props.background }">
        <input type="text" :placeholder="props.msg" v-model.trim="commentInput" @keyup.enter="send">
        <span class="@">@</span>
        <span class="sendBtn iconfont icon-tick" @click="send"></span>
    </div>
</template>

<style lang="scss" scoped>
.send {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 44px;
    display: flex;
    background-color: #31333B;

    input {
        flex: 1;
        padding-left: 15px;
        color: #fff;
    }

    span {
        width: 44px;
        line-height: 44px;
        text-align: center;
        color: #fff;
    }
}
</style>