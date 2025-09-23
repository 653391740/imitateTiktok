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
        const id = route.params.id ? (route.params.id !== 'me' ? route.params.id : LoginStore.userinfo.userId) : LoginStore.userinfo.userId
        console.log(id);
        const res = await attrs.onLoad(id, page.value)
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
        userinfoContainer.addEventListener('touchmove', () => {
            const { top, height } = userinfoContainer.getBoundingClientRect()
            newDom.value = {
                scrollTop: top < 0 ? Math.abs(top) : 0,
                clientHeight: window.innerHeight,
                scrollHeight: height
            }
        })
    }
})

const actveindex = ref(0)
</script>
<template>
    <div class="concern" :class="{ 'vh': isVideoAndDesc }">
        <Pullupload class="concern-list" @pullup="handleScroll" :newDom="newDom" :error="error" :hasMore="hasMore">
            <ConcernItem v-for="item, index in List" :key="index" :obj="item.value" :index="index"
                :actveindex="actveindex" />
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