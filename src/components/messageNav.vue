<script setup>
import { ref, useAttrs } from 'vue'
import Title from '@/components/title.vue'

const attrs = useAttrs()
const pulluploadRef = ref(null)
const error = ref(false)
const hasMore = ref(true)
const page = ref(1)
const List = ref([])

/**
 * 判断两个对象内容是否完全相同
 * @param {Object} obj1 - 第一个对象
 * @param {Object} obj2 - 第二个对象
 * @returns {Boolean} - 如果两个对象内容完全相同返回 true，否则返回 false
 */
const isObjectEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 判断属性数量是否相同
    if (keys1.length !== keys2.length) return false;

    // 递归比较每个属性
    for (const key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!isObjectEqual(obj1[key], obj2[key])) return false;
    }

    return true;
};

const loadmore = async () => {
    try {
        const data = await attrs.onLoadmore(page.value)
        for (const item of List.value) {
            if (isObjectEqual(item, data[0])) return
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
    <Pullupload ref="pulluploadRef" @pullup="loadmore" :error="error" :hasMore="hasMore">
        <li v-for="item, index in List" :key="index">
            <img :src="$imgSrc(item.userAvatar)">
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
            border-radius: 50%;
            margin-right: 10px;
        }

        .info {
            color: #fff;
        }
    }
}
</style>