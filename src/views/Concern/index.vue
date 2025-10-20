<script setup>
import { ref, onMounted } from 'vue'
import { loginStore } from '@/stores/counter'
import { FollowerVideo, isLiked } from '@/api/video'
import ConcernItem from '@/views/Concern/concern-item.vue'
const LoginStore = loginStore()
const List = ref([])
const page = ref(1)
const error = ref(false)
const hasMore = ref(true)
const pulluploadRef = ref(null)

const handleScroll = async () => {
    try {
        const res = await FollowerVideo(LoginStore.userinfo.userId, page.value)
        if (res.length === 0) return hasMore.value = false
        const updatedRes = await Promise.allSettled(res.map(async e => {
            if (!e.Video) return e
            try {
                const likedRes = await isLiked(LoginStore.userinfo.userId, e.Video.videoId)
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
    }
}

onMounted(() => {
    handleScroll()
})
</script>
<template>
    <Pullupload style="padding-bottom: 50px;" ref="pulluploadRef" @pullup="handleScroll" :error="error"
        :hasMore="hasMore">
        <ConcernItem v-for="item, index in List" :key="index" :obj="item.value" />
    </Pullupload>
</template>
<style lang="scss" scoped></style>