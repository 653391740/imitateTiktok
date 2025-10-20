<script setup>
import { ref, useAttrs } from 'vue'
import Title from '@/components/title.vue'

const attrs = useAttrs()
const pulluploadRef = ref(null)
const error = ref(false)
const hasMore = ref(true)
const page = ref(1)
const List = ref([])
const loadmore = async () => {
    try {
        const data = await attrs.onLoadmore(page.value)
        if (!data) return hasMore.value = false
        List.value.push(...data)
        page.value++
    } catch (err) {
        error.value = true
        console.log(err);
    }
}

</script>
<template>
    <Title title="粉丝" back></Title>
    <Pullupload ref="pulluploadRef" @pullup="loadmore" :error="error" :hasMore="hasMore">
        <li v-for="item, index in List" :key="index">
            <img :src="$imgSrc(item.userAvatar)">
            <div class="info">
                <p class="user-name">{{ item.userNickname }}</p>
                <p>{{ attrs.type }}</p>
                <p class="time">{{ $formatTime(item.createdAt) }}</p>
            </div>
            <div class="right">
                <slot name="right" :item="item"></slot>
            </div>
        </li>
    </Pullupload>
</template>

<style lang="scss" scoped>
.pullupload {
    padding-top: 44px;

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
            margin-right: 10px;
        }

        .info {
            color: #fff;

            .time {
                color: #8b8c96;
                font-size: 11px;
                line-height: 11px;
                margin-top: 7px;
            }
        }
    }
}
</style>