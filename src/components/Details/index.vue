<script setup>
import { ref, useAttrs } from 'vue'
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
        const res = await attrs.onLoad(id, page.value)
        if (res.length === 0) return hasMore.value = false
        res.map(async e => {
            if (!e.Video) return e
            try {
                const likedRes = await isLiked(LoginStore.userinfo.userId, e.Video.videoId)
                e.isLiked = likedRes
            } catch (error) {
                e.isLiked = false
            }
            return e
        })
        List.value.push(...res)
        page.value++
    } catch (err) {
        console.log(err);
        error.value = true
    }
    console.log(List.value);

}
const actveindex = ref(0)
</script>
<template>
    <div class="concern" :class="{ 'vh': route.path.includes('videoAndDesc') }">
        <Pullupload class="concern-list" @pullup="handleScroll" :newDom="attrs.newDom" :error="error"
            :hasMore="hasMore">
            <ConcernItem v-for="item, index in List" :key="index" :obj="item" :index="index"
                v-model:actveindex="actveindex" />
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