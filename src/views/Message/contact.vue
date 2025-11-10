<script setup>
import Title from '@/components/title.vue'
import both from '@/components/both.vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const selected = (obj) => {
    router.push({ name: 'user', params: { id: obj.userId } })
}
</script>
<template>
    <Title title="选择联系人" back></Title>
    <both @selected="selected"></both>
</template>

<style lang="scss" scoped></style>