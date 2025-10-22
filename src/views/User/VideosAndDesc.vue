<script setup>
import Details from '@/components/Details/index.vue'
import { VideosPage } from '@/api/user'
const loadMore = async (userId, page) => {
    return await VideosPage(userId, page)
}
</script>
<template>
    <Details class="concern" @load="loadMore"></Details>
</template>
<style lang="scss" scoped></style>