<script setup>
import Videoslist from '@/components/Videoslist.vue'
import { VideosPage } from '@/api/user'
const loadMore = async (userId, page) => {
    return await VideosPage(userId, page)
}
</script>
<template>
    <Videoslist @loadmore="loadMore" :showDeleteIcon="true" />
</template>

<style lang="scss" scoped></style>