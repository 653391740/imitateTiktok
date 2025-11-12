<script setup>
import { ref, watch, toRefs, nextTick } from 'vue'
import { searchUser } from '@/api/video'
import { loginStore, searchStore } from '@/stores/counter'
const { inputvalue, searchType } = toRefs(searchStore())
const { userinfo } = loginStore()
import Followbtn from '@/components/Followbtn.vue'

const list = ref([])
const error = ref(false)
const hasMore = ref(true)
const page = ref(1)
const loading = async () => {
    try {
        if (page.value === 1 && list.value.length > 0) list.value = []
        const res = await searchUser(userinfo.userId, page.value, { key: inputvalue.value })
        if (res.length === 0) return hasMore.value = false
        nextTick(() => { list.value.push(...res) })
        page.value++
    } catch (err) {
        console.log(err);
        error.value = true
    }
}
watch(inputvalue, (newValue, oldValue) => {
    if (newValue !== oldValue && searchType.value === 'user') {
        page.value = 1
        hasMore.value = true
        loading()
    }
}, { flush: 'post' })
</script>

<template>
    <Pullupload ref="pulluploadRef" @pullup="loading" :error="error" :hasMore="hasMore" :onMount="true">
        <div v-for="item in list" :key="item.userId" class="item">
            <img v-lazy="$imgSrc(item.userAvatar)" alt="">
            <div class="info">
                <p class="name">{{ item.userNickname }}</p>
                <p class="desc">{{ item.userDesc }}</p>
            </div>
            <Followbtn :item="item" :myUserId="userinfo.userId"></Followbtn>
        </div>
    </Pullupload>
</template>


<style lang="scss" scoped>
.item {
    display: flex;
    align-items: center;
    padding: 0px 20px 20px;

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 12px;
    }

    .info {
        flex: 1;
        overflow: hidden;

        .name {
            color: #fff;
            margin: 0 0 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .desc {
            font-size: 12px;
            color: #999;
            margin: 0;
        }
    }
}
</style>