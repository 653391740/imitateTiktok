<script setup>
import { searchUser } from '@/api/video'
import { triggerFollow } from '@/api/Chat'
import ListTemplate from './list-template.vue'
import { loginStore } from '@/stores/counter'
const { userinfo } = loginStore()
const loading = async (id, page, data) => {
    return await searchUser(id, page, data)
}
const handleFollow = async (item) => {
    await triggerFollow(userinfo.userId, item.userId)
    item.myRelation = item.myRelation === 'fan' ? 'both' : item.myRelation === 'none' ? 'follow' : item.myRelation === 'both' ? 'fan' : 'none'
}
</script>

<template>
    <ListTemplate @load="loading">
        <template #default="{ list }">
            <div v-for="item in list" :key="item.userId" class="item">
                <img :src="$imgSrc(item.userAvatar)" alt="">
                <div class="info">
                    <p class="name">{{ item.userNickname }}</p>
                    <p class="desc">{{ item.userDesc }}</p>
                </div>
                <div class="btn" @click="handleFollow(item)"
                    :class="{ 'active': !(item.myRelation === 'none' || item.myRelation === 'fan') }">
                    {{ item.myRelation === 'none' || item.myRelation === 'fan' ? '关注' : item.myRelation === 'follow' ?
                        '已关注' : '互相关注' }}</div>
            </div>
        </template>
    </ListTemplate>
</template>


<style lang="scss" scoped>
.btn {
    background-color: #f8355f;
    text-align: center;
    line-height: 25px;
    font-size: 12px;
    width: 70px;
    height: 25px;
    color: #fff;

    &.active {
        background-color: #383b44;
    }
}

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