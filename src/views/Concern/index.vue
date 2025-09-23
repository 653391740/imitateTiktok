<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { loginStore } from '@/stores/counter'
import { FollowerVideo, isLiked } from '@/api/video'
import ConcernItem from '@/views/Concern/concern-item.vue'
const { proxy } = getCurrentInstance()
const LoginStore = loginStore()
const List = ref([])
const page = ref(1)
const error = ref(false)
const hasMore = ref(true)
const pulluploadRef = ref(null)

const handleScroll = async () => {
    try {
        proxy.$toast.loading('加载中')
        const res = await FollowerVideo(LoginStore.userId, page.value)
        if (res.length === 0) return hasMore.value = false
        const updatedRes = await Promise.allSettled(res.map(async e => {
            if (!e.Video) return e
            try {
                const likedRes = await isLiked(LoginStore.userId, e.Video.videoId)
                e.isLiked = likedRes
            } catch (error) {
                e.isLiked = false
            }
            return e
        }))
        List.value.push(...updatedRes)
        page.value++
    } catch (error) {
        console.log(error);
        error.value = true
    } finally {
        proxy.$toast.clear()
    }
}

onMounted(() => {
    handleScroll()
})
</script>
<template>
    <Pullupload style="padding-bottom: 50px;" ref="pulluploadRef" @pullup="handleScroll" :error="error"
        :hasMore="hasMore">
        <ConcernItem v-for="item, index in List" :key="index" :obj="item" />
    </Pullupload>
</template>
<style lang="scss" scoped></style>