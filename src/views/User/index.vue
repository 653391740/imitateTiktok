<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { loginStore } from '@/stores/counter';
import { useRouter, useRoute } from 'vue-router';
import { FollowersNum, FansNum, byLikesNum, LikesNum, VideosNum } from '@/api/Chat'
import { getUserInfo } from '@/api/user'

const router = useRouter()
const route = useRoute()
const { userinfo, logout } = loginStore()
const userInfo = ref({ ...userinfo })
const Followersnum = ref(0)
const Fansnum = ref(0)
const Likesnum = ref(0)
const byLikesnum = ref(0)
const Videosnum = ref(0)


const showMenu = ref(false)
const userinfoContainer = ref(null)
const userinfoDom = ref(null)
const bg = ref(null)
const y = ref(0)
const diffY = ref(0)
const timer = ref(null)
const tmove = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = userinfoContainer.value
    if (clientHeight == scrollHeight) return
    const max = 150 + diffY.value + (y.value === 0 ? 0 : e.touches[0].pageY) - y.value
    if (scrollTop === 0) {
        scrollTops.value = 0
        if (y.value === 0) y.value = e.touches[0].pageY
        if (max > 350) {
            userinfoContainer.value.removeEventListener('touchmove', tmove)
            tend()
            return
        }
        userinfoDom.value.style.marginTop = `${max}px`
        bg.value.style.height = `${max < 150 ? 150 : max}px`
    } else {
        if (scrollTops.value === 0) userinfoContainer.value.scrollTop = 0
        userinfoDom.value.style.marginTop = `${max}px`
        bg.value.style.height = `${max < 150 ? 150 : max}px`
    }
}
const scrollTops = ref(0)
const tend = (e) => {
    const mtop = parseFloat(window.getComputedStyle(userinfoDom.value).marginTop)
    if (mtop < 150) {
        scrollTops.value = 150 - mtop
        userinfoContainer.value.scrollTo({
            top: scrollTops.value,
            left: 0,
            behavior: 'instant'
        })
    }
    userinfoDom.value.style.transition = mtop < 150 ? 'none' : 'all .7s cubic-bezier(0.165, 0.84, 0.44, 1)'
    userinfoDom.value.style.marginTop = '150px'
    bg.value.style.transition = 'all .7s cubic-bezier(0.165, 0.84, 0.44, 1)'
    bg.value.style.height = '150px'
    y.value = 0
    diffY.value = 0
    timer.value = setTimeout(() => {
        userinfoDom.value.style.transition = 'none'
        bg.value.style.transition = 'none'
    }, 700)
}
const tstart = () => {
    if (timer.value) clearTimeout(timer.value)
    userinfoContainer.value.addEventListener('touchmove', tmove)
    const height = window.getComputedStyle(bg.value).height
    userinfoDom.value.style.marginTop = height
    userinfoDom.value.style.transition = 'none'
    bg.value.style.height = height
    bg.value.style.transition = 'none'
    diffY.value = parseFloat(height) - 150
}
const toUpdateUserInfo = () => {
    router.push({ name: 'UpdateUserInfo' })
}
onMounted(async () => {
    userinfoContainer.value.addEventListener('touchstart', tstart)
    userinfoContainer.value.addEventListener('touchend', tend)
    const id = route.params.id === 'me' ? userinfo.userId : route.params.id
    if (id !== userinfo.userId) userInfo.value = await getUserInfo(id, userinfo.userId)
    console.log(id);
    Followersnum.value = await FollowersNum(id)
    Fansnum.value = await FansNum(id)
    Likesnum.value = await LikesNum(id)
    byLikesnum.value = await byLikesNum(id)
    Videosnum.value = await VideosNum(id)
})

const showDialog = ref(false)
const Logout = () => {
    logout()
    router.push({ path: '/home' })
}
</script>
<template>
    <Dialog :show="showDialog" :options="{ title: '是否保存修改' }" @close="showDialog = false" @confirm="Logout" />
    <div class="backbtn-wrap">
        <div class="r" v-if="route.params.id == 'me'" @click="showMenu = !showMenu">...</div>
        <div class="l iconfont icon-zuojiantou" v-else @click="router.back()"></div>
        <ul class="more-menu" :class="{ 'show': showMenu }">
            <li @click="toUpdateUserInfo">修改个人资料</li>
            <li @click="showDialog = true">注销</li>
        </ul>
    </div>
    <div class="userinfo-container" ref="userinfoContainer" :class="{ 'pb': route.params.id === 'me' }">
        <img src="/src/assets/bg.jpg" class="bg" ref="bg">
        <div class="userinfo" ref="userinfoDom">
            <div class="avatar">
                <img :src="$imgSrc(userInfo.userAvatar)">
            </div>
            <div class="info">
                <div class="name">{{ userInfo.userNickname }}</div>
                <div class="uid">抖音号 : {{ userInfo.userId }}</div>
                <div class="desc">{{ userInfo.userDesc }}</div>
                <div class="gender">
                    <div :class="userInfo.userGender === '男' ? 'icon-nan' : 'icon-nv'" class="iconfont"></div>
                    <p>{{ userInfo.userAge }}岁</p>
                </div>
                <div class="num-wrap">
                    <div>
                        <p>{{ byLikesnum }}</p>
                        <span>获赞</span>
                    </div>
                    <div>
                        <p>{{ Followersnum }}</p>
                        <span>关注</span>
                    </div>
                    <div>
                        <p>{{ Fansnum }}</p>
                        <span>粉丝</span>
                    </div>
                </div>
            </div>
        </div>
        <nav>
            <router-link :to="`/user/${route.params.id}/videos`">作品{{ Videosnum }}</router-link>
            <router-link :to="`/user/${route.params.id}/videoAndDesc`">动态{{ Videosnum }}</router-link>
            <router-link :to="`/user/${route.params.id}/likes`">喜欢{{ Likesnum }}</router-link>
        </nav>
        <router-view></router-view>
    </div>
</template>
<style lang="scss" scoped>
.backbtn-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 48px;

    .more-menu {
        position: absolute;
        top: 55px;
        right: 10px;
        width: 80px;
        background: rgba(22, 24, 35, 0.6);
        transform: translateY(100px);
        transition: all 0.4s ease;
        opacity: 0;

        &.show {
            opacity: 1;
            transform: translateY(0);
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 5px;
            transform: translateY(-100%);
            border: 10px solid transparent;
            border-bottom-color: rgba(22, 24, 35, 0.6);
        }

        li {
            line-height: 44px;
            text-align: center;
            color: #e8e8e9;
            font-size: 12px;
        }
    }

    @mixin lr-btn {
        position: absolute;
        top: 10px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        width: 28px;
        height: 28px;
        background: rgba(22, 24, 35, 0.6);
    }

    .r {
        right: 10px;
        @include lr-btn;
    }

    .l {
        font-size: 10px;
        line-height: 28px;
        left: 10px;
        @include lr-btn;
    }
}

.userinfo-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: auto;
    scrollbar-width: none;

    &.pb {
        padding-bottom: 50px;
    }

    &.noShow {
        position: relative;
        z-index: 2;
    }


    nav {
        display: flex;

        a {
            z-index: 2;
            flex: 1;
            line-height: 42px;
            text-align: center;
            color: #fff;
            background-color: $backcolor;

            &.router-link-active {
                border-bottom: 2px solid yellow;
            }
        }
    }

    .userinfo {
        z-index: 2;
        margin-top: 150px;
        color: #fff;
        padding: 0 10px;
        position: relative;
        background-color: $backcolor;

        .info {
            padding: 75px 10px 10px;

            .num-wrap {
                margin-top: 10px;
                width: 200px;
                display: flex;
                justify-content: space-between;

                div {
                    display: flex;
                }
            }

            .gender {
                display: flex;
                padding: 5px 8px;
                border-radius: 5px;
                background: rgba(67, 51, 63, 0.7);
                font-size: 10px;
                line-height: 10px;
                width: fit-content;
                color: #8b8c96;

                .iconfont {
                    font-size: 10px;
                    margin-right: 5px;
                }

                .icon-nan {
                    color: #14bae2;
                }

                .icon-nv {
                    color: pink;
                }
            }

            .desc {
                margin-top: 10px;
                border-top: $bordB;
                color: #8b8c96;
                font-size: 12px;
                line-height: 35px;
            }

            .name {
                font-size: 22px;
            }

            .uid {
                font-size: 12px;
            }
        }

        .avatar {
            position: absolute;
            top: -20px;
            width: 90px;
            height: 90px;
            line-height: 90px;
            text-align: center;
            border-radius: 50%;
            background-color: $backcolor;
            vertical-align: middle;

            img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
        }
    }

}

.bg {
    width: 100%;
    height: 150px;
    object-fit: cover;
    position: fixed;
    top: 0;
    left: 0;
}
</style>