<script setup>
import Videoslist from '@/components/Videoslist.vue'
import { getLikesPage } from '@/api/user'
const loadMore = async (userId, page) => {
    return await getLikesPage(userId, page)
}
</script>
<template>
    <Videoslist :onLoadmore="loadMore" />
</template>

<style lang="scss" scoped></style>