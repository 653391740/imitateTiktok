<script setup>
import { defineProps, getCurrentInstance, computed, ref, watch } from 'vue'
import { triggerFollow } from '@/api/Chat'
const { proxy } = getCurrentInstance()
const socket = proxy.$socket
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    myUserId: {
        type: String,
        required: true
    },
    defaultmyRelation: {
        type: String,
        default: 'none'
    }
})
watch(() => props.item, (newVal) => {
    myRelation.value = newVal?.myRelation
    bothStatus.value = newVal?.bothStatus
})
const userId = computed(() => props.item?.userId ?? '')
const bothStatus = ref(props.item?.bothStatus)

// 根据默认关系状态设置初始关系状态
const defaultRelation = computed(() => {
    if (props.defaultmyRelation === 'fan') {
        return bothStatus.value ? 'both' : 'fan'
    } else if (props.defaultmyRelation === 'follow') {
        return bothStatus.value ? 'both' : 'follow'
    }
})
// 定义一个响应式变量来存储关系状态
const myRelation = ref(props.item?.myRelation ?? defaultRelation.value)
// 判断是否关注
const followStatus = computed(() => myRelation.value === 'both' || myRelation.value === 'follow' || myRelation.value === 'me')
// 根据关系状态显示不同的文本
const textFollow = computed(() => {
    if (myRelation.value === 'me') return '我自己'
    if (myRelation.value === 'none' || myRelation.value === 'fan') {
        return '关注'
    } else {
        if (myRelation.value === 'follow') {
            return '已关注'
        } else {
            return '互相关注'
        }
    }
})
// 根据关系状态设置按钮样式
const updataView = () => {
    switch (myRelation.value) {
        case 'fan':
            myRelation.value = 'both'
            break
        case 'follow':
            myRelation.value = 'none'
            break
        case 'both':
            myRelation.value = 'fan'
            break
        case 'none':
            myRelation.value = 'follow'
            break
    }
    proxy.$toast.show(followStatus.value ? '关注成功' : '取关成功')
}
const handleFollow = async () => {
    if (myRelation.value === 'me') return
    try {
        updataView()
        await triggerFollow(props.myUserId, userId.value)
        socket.emit('sendTriggerFollow', { toUserId: userId.value })
    } catch (err) {
        console.log(err);
        updataView()
    }
}
</script>

<template>
    <div class="btn" @click="handleFollow" :class="{ 'active': followStatus }">{{ textFollow }}</div>
</template>

<style lang="scss" scoped>
.btn {
    background-color: #f8355f;
    text-align: center;
    line-height: 25px;
    font-size: 12px;
    width: 70px;
    height: 25px;
    color: #fff;

    &.active {
        background-color: #383b44;
    }
}
</style>