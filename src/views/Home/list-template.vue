<script setup>
import { ref, useAttrs, watch, toRefs } from 'vue'
import { loginStore, searchStore } from '@/stores/counter'
const { userinfo } = loginStore()
const { inputvalue } = toRefs(searchStore())
const error = ref(false)
const hasMore = ref(true)
const page = ref(1)
const attrs = useAttrs()
const list = ref([])
watch(inputvalue, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        page.value = 1
        hasMore.value = true
        handleScroll()
    }
}, { flush: 'post' })

const handleScroll = async () => {
    try {
        const res = await attrs.onLoad(userinfo.userId, page.value, { key: inputvalue.value })
        if (res.length === 0) return hasMore.value = false
        if (page.value === 1 && list.value.length > 0) {
            list.value = res
        } else {
            list.value.push(...res)
        }
        page.value++
    } catch (err) {
        console.log(err);
        error.value = true
    }
}
</script>

<template>
    <Pullupload ref="pulluploadRef" @pullup="handleScroll" :error="error" :hasMore="hasMore">
        <slot :list="list"></slot>
    </Pullupload>
</template>

<style lang="scss" scoped></style>