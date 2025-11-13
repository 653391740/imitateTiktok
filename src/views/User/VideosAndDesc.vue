<script setup>
import Details from '@/components/Details/index.vue'
import { VideosPage } from '@/api/user'
import { useScrollPosition } from '@/hooks/useScrollPosition'
const { newDom } = useScrollPosition()
const loadMore = async (userId, page) => {
    return await VideosPage(userId, page)
}
</script>
<template>
    <Details class="concern" @load="loadMore" :newDom="newDom"></Details>
</template>
<style lang="scss" scoped></style>