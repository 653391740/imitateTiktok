<script setup>
import { ref, onMounted, computed, nextTick, onBeforeUnmount, watch } from 'vue'
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
    return p.getFirstLetter(nickname).toUpperCase().charAt(0)
}
onMounted(async () => {
    list.value = await searchUser(LoginStore.userinfo.userId)
    const quchong = []
    list.value.map(item => {
        const current = firstName(item.userNickname)
        if (!quchong.includes(current) && /^[A-Za-z]$/.test(current)) quchong.push(current)
    })
    quchong.sort()
    firstnameList.value = [...quchong, '#'];

    await nextTick()
    const container = stickyElm.value
    if (!container) return
    const uls = Array.from(container.querySelectorAll('.title'))
    observer = new IntersectionObserver((entries) => {
        console.log(entries[0].boundingClientRect.top, entries[0].target, entries[0].isIntersecting);
        if (entries[0].boundingClientRect.top < 110 && searchText.value === '') {
            if (entries[0].isIntersecting) {
                activeLetter.value = entries[0].target.textContent
            } else {
                activeLetter.value = entries[0].target.parentElement.nextElementSibling.querySelector('.title').textContent
            }
        }

    }, { root: container, threshold: [1] })
    uls.forEach(t => observer.observe(t))
})

onBeforeUnmount(() => {
    if (observer) observer.disconnect()
})

watch(searchText, (val) => {
    if (val) activeLetter.value = ''
    else activeLetter.value = firstnameList.value[0] || ''
})
const pushChatWith = (item) => {
    const { userDesc, ...query } = item
    router.push({
        path: '/chatWith',
        query
    })
}
const scrollToLetter = (val) => {
    const container = stickyElm.value
    if (!container) return
    const titles = Array.from(container.querySelectorAll('.title'))
    const target = titles.find(t => t.textContent.trim() === val)
    if (target) {
        const offsetTop = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
        container.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
    activeLetter.value = val
}
const stickyElm = ref(null)
const activeLetter = ref('')
let observer = null
</script>
<template>
    <Title title="选择联系人" back></Title>
    <div class="content">
        <div class="search-bar">
            <span class="iconfont icon-sousuo"></span>
            <input type="text" placeholder="搜索用户昵称" v-model.trim="searchText">
        </div>
        <div class="contact-list" ref="stickyElm">
            <ul v-for="value in firstnameList" :key="value">
                <div class="title" v-if="!searchText">{{ value }}</div>
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
            <li v-for="item in firstnameList" :key="item" :class="{ active: item === activeLetter }"
                @click="scrollToLetter(item)">{{ item }}</li>
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

    li.active {
        color: #face15;
        font-weight: 600;
    }
}

.content {
    padding-top: 44px;
}

.contact-list {
    padding: 0 30px 10px 20px;
    height: calc(100vh - 109px);
    overflow: auto;

    ul {
        margin-bottom: 10px;

        .title {
            color: #fff;
            line-height: 30px;
            position: sticky;
            top: 0;
            z-index: 2;
            background-color: $backcolor;
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