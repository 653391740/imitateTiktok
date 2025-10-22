<script setup>
import Details from '@/components/Details/index.vue'
import { FollowerVideo } from '@/api/video'
const loadMore = async (userId, page) => {
    return await FollowerVideo(userId, page)
}
</script>
<template>
    <Details @load="loadMore"></Details>
</template>
<style lang="scss" scoped></style>