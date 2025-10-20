<script setup>
import { ref, onMounted, computed } from 'vue'
import { searchUser } from '@/api/user'
import { loginStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
import p from "wl-pinyin";
import Title from '@/components/title.vue'

const LoginStore = loginStore()
const router = useRouter()
const searchText = ref('')
const list = ref([])
const firstnameList = ref([])

const filterList = computed(() => {
    if (searchText.value) return list.value.filter(item => p.getPinyin(item.userNickname).toUpperCase().includes(searchText.value.toUpperCase()))
    return list.value
})
const firstName = (nickname) => {
    return p.getFirstLetter(nickname).charAt(0)
}
onMounted(async () => {
    list.value = await searchUser(LoginStore.userinfo.userId)
    firstnameList.value = [...list.value.map(item => firstName(item.userNickname)).sort((a, b) => a - b), '#'];
})
const pushChatWith = (item) => {
    const { userDesc, ...query } = item
    router.push({
        path: '/chatWith',
        query
    })
}
</script>
<template>
    <Title title="选择联系人" back></Title>
    <div class="content">
        <div class="search-bar">
            <span class="iconfont icon-sousuo"></span>
            <input type="text" placeholder="搜索用户昵称" v-model.trim="searchText">
        </div>
        <div class="contact-list">
            <ul v-for="value in firstnameList" :key="value">
                <p v-if="!searchText">{{ value }}</p>
                <li @click="router.push({ name: 'user', params: { id: item.userId } })" v-for="item in filterList"
                    :key="item.userId" :class="{ 'include-search-text': searchText }"
                    v-show="firstName(item.userNickname) === value || (!/^[A-Za-z]$/.test(firstName(item.userNickname)) && value === '#')">
                    <img :src="$imgSrc(item.userAvatar)">
                    <div class="contact-info">
                        <div class="nickname">{{ item.userNickname }}</div>
                        <div class="desc">{{ item.userDesc }}</div>
                        <span class="iconfont icon-pinglun" @click.stop="pushChatWith(item)"></span>
                    </div>
                </li>
            </ul>
        </div>
        <ul class="aside">
            <li class="iconfont icon-sousuo"></li>
            <li v-for="item in firstnameList" :key="item">{{ item }}</li>
        </ul>
    </div>
</template>


<style lang="scss" scoped>
.aside {
    position: fixed;
    color: #fff;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    text-align: center;

    li {
        line-height: 22px;
    }

    .icon-sousuo {
        color: #face15;
        font-size: 12px;
    }
}

.content {
    padding-top: 44px;
}

.contact-list {
    padding: 10px 30px 10px 20px;
    height: calc(100vh - 109px);
    overflow: auto;

    ul {
        padding-bottom: 10px;

        p {
            color: #fff;
            line-height: 30px;
        }

        li {
            padding-top: 20px;
            display: flex;
            align-items: center;

            &.include-search-text {
                padding-top: 0;
                padding-bottom: 20px;
            }

            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .contact-info {
                position: relative;
                flex: 1;

                .nickname {
                    color: #fff;
                }

                .desc {
                    font-size: 12px;
                    color: #888;
                    line-height: 22px;
                }

                .iconfont {
                    font-size: 18px;
                    color: #fff;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
    }
}

.search-bar {
    margin: 10px 20px;
    background: #242630;
    border-radius: 5px;
    height: 44px;
    display: flex;
    align-items: center;

    span {
        width: 44px;
        line-height: 44px;
        text-align: center;
        color: #fff;
    }

    input {
        flex: 1;
        height: 44px;
        color: #fff;
        padding-right: 10px;
    }
}
</style>