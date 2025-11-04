<script setup>
import { defineProps, getCurrentInstance, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { triggerFollow } from '@/api/Chat'
const { proxy } = getCurrentInstance()
const socket = proxy.$socket
const route = useRoute()
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    myUserId: {
        type: String,
        required: true
    }
})
watch(() => props.item, (newVal) => {
    myRelation.value = newVal?.myRelation
    bothStatus.value = newVal?.bothStatus
})
const userId = computed(() => props.item?.userId ?? '')
const myRelation = ref(props.item?.myRelation)
const bothStatus = ref(props.item.bothStatus)

const textFollow = computed(() => {
    if (myRelation.value == undefined) {
        return bothStatus.value ? (route.path === '/fan' ? '互相关注' : '已关注') : '关注'
    } else {
        return myRelation.value === 'none' || myRelation.value === 'fan'
            ? '关注' : myRelation.value === 'follow'
                ? '已关注' : '互相关注'
    }
})

const updataView = () => {
    if (myRelation.value == undefined) {
        bothStatus.value = bothStatus.value === 1 ? 0 : 1
        proxy.$toast.show(bothStatus.value ? '关注成功' : '取关成功')
    } else {
        myRelation.value = myRelation.value === 'fan'
            ? 'both' : myRelation.value === 'none'
                ? 'follow' : myRelation.value === 'both'
                    ? 'fan' : 'none'
    }
}
const handleFollow = async () => {
    try {
        updataView()
        await triggerFollow(props.myUserId, userId.value)
        socket.emit('sendTriggerFollow', {
            toUserId: userId.value
        })
    } catch (err) {
        console.log(err);
        updataView()
    }
}
</script>

<template>
    <div class="btn" @click="handleFollow()" :class="{
        'active': myRelation == undefined
            ? bothStatus : !(myRelation === 'none' || myRelation === 'fan')
    }">{{ textFollow }}</div>
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