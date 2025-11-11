<script setup>
import { ref, useAttrs } from 'vue'
import { loginStore } from '@/stores/counter'
import Title from '@/components/title.vue'

const { userinfo } = loginStore()
const attrs = useAttrs()
const pulluploadRef = ref(null)
const error = ref(false)
const hasMore = ref(true)
const page = ref(1)
const List = ref([])
const stop = ref(false)

const loadmore = async () => {
    if (stop.value) return
    try {
        const data = await attrs.onLoadmore(userinfo.userId, page.value)
        if (JSON.stringify(List.value) === JSON.stringify(data)) {
            stop.value = true
            hasMore.value = false
            return
        }
        if (data.length === 0) return hasMore.value = false
        List.value.push(...data)
        page.value++
        error.value = false
    } catch (err) {
        error.value = true
        console.log(err);
    }
}
</script>
<template>
    <Title :title="attrs.title" back></Title>
    <Pullupload class="pullup" ref="pulluploadRef" @pullup="loadmore" :error="error" :hasMore="hasMore">
        <li v-for="item, index in List" :key="index">
            <img v-lazy="$imgSrc(item.userAvatar)">
            <div class="info">
                <p class="user-name">{{ item.userNickname }}</p>
                <slot name="left" :item="item"></slot>
            </div>
            <div class="right">
                <slot name="right" :item="item"></slot>
            </div>
        </li>
        <template #noMore :item="item" v-if="List.length === 0 && !hasMore">
            <div class="noList">
                <p>{{ attrs.nomsgTitle || '暂无数据' }}</p>
                <span>{{ attrs.nomsgDesc || '暂无更多数据' }}</span>
            </div>
        </template>
    </Pullupload>
</template>

<style lang="scss" scoped>
.pullup {
    height: calc(100% - 45px);
}
.noList {
    margin: 120px auto 0;

    p {
        color: #e8e8e9;
        font-size: 16px;
        margin-bottom: 10px;
    }

    span {
        color: #8b8c96;
        font-size: 12px;
        line-height: 12px;
    }
}

.pullupload {

    li {
        padding: 10px;
        display: flex;
        align-items: center;
        position: relative;
        background-color: #1c1f2a;

        .right {
            display: flex;
            justify-content: flex-end;
            color: #fff;
            flex: 1;
        }

        img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .info {
            color: #fff;
        }
    }
}
</style>