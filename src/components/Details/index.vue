<script setup>
import { ref, useAttrs, onMounted } from 'vue'
import { loginStore } from '@/stores/counter'
import { isLiked } from '@/api/video'
import ConcernItem from './concern-item.vue'
import { useRoute } from 'vue-router'
const LoginStore = loginStore()
const route = useRoute()
const List = ref([])
const page = ref(1)
const error = ref(false)
const hasMore = ref(true)

const attrs = useAttrs()
const handleScroll = async () => {
    try {
        const res = await attrs.onLoad(LoginStore.userinfo.userId, page.value)
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
    } catch (err) {
        console.log(err);
        error.value = true
    }
}
const newDom = ref({})
const isVideoAndDesc = ref(false)
onMounted(() => {
    if (route.path.includes('videoAndDesc')) isVideoAndDesc.value = true
    if (isVideoAndDesc.value) {
        const userinfoContainer = document.querySelector('.userinfo-container')
        userinfoContainer.addEventListener('scroll', () => {
            const { scrollTop, clientHeight, scrollHeight } = userinfoContainer
            newDom.value = { scrollTop, clientHeight, scrollHeight }
        })
    }
})
</script>
<template>
    <div class="concern" :class="{ 'vh': isVideoAndDesc }">
        <Pullupload class="concern-list" @pullup="handleScroll" :newDom="newDom" :error="error" :hasMore="hasMore">
            <ConcernItem v-for="item, index in List" :key="index" :obj="item.value" />
        </Pullupload>
    </div>
</template>
<style lang="scss" scoped>
.concern {
    background-color: $backcolor;
    height: calc(100vh - 50px);
    overflow: auto;
    position: relative;

    &.vh {
        height: fit-content;

        .concern-list {
            height: fit-content;
        }
    }
}
</style>