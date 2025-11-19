<script setup>
import { ref, defineEmits, defineProps, defineExpose } from 'vue'
const emit = defineEmits(['sendComment', 'sendat'])
const props = defineProps({
    msg: {
        type: String,
        default: '有爱评论,说点好听的~'
    },
    backgroundC: {
        type: String,
        default: '#161622'
    }
})
const commentInput = ref('')
const send = () => {
    emit('sendComment', commentInput.value)
    commentInput.value = ''
}
const addcommentInput = (str) => {
    commentInput.value += str
}
defineExpose({
    addcommentInput,
    commentInput
})
</script>
<template>
    <div class="send" :style="{ backgroundColor: props.backgroundC }">
        <input type="text" :placeholder="props.msg" v-model.trim="commentInput" @keyup.enter="send">
        <span class="@" @click="emit('sendat')">@</span>
        <span class="sendBtn iconfont icon-tick" @click="send"></span>
    </div>
</template>

<style lang="scss" scoped>
.send {
    border-top: $bordB;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;

    input {
        flex: 1;
        padding-left: 15px;
        color: #fff;
    }

    span {
        width: 44px;
        line-height: 50px;
        text-align: center;
        color: #fff;
    }
}
</style>