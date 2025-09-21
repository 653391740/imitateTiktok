<script setup>
import { commentStore } from '@/stores/counter'
const CommentStore = commentStore()
</script>

<template>
    <popup @click="CommentStore.showPopup = false" position="bottom" background-color="transparent"
        :show="CommentStore.showPopup">
        <div @click.stop class="commentPopup">

        </div>
    </popup>
</template>

<style lang="scss" scoped>
.commentPopup {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 65vh;
    background: rgba(22, 24, 35, 0.98);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}
</style>