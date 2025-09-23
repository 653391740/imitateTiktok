<script setup>
import { ref, onMounted, nextTick, onActivated, onUnmounted } from 'vue'
import { loginStore } from '@/stores/counter'
import { useRouter, useRoute } from 'vue-router'
import { FollowersNum, FansNum, byLikesNum, LikesNum, VideosNum } from '@/api/Chat'
import { getUserInfo } from '@/api/user'
import Followbtn from '@/components/Followbtn.vue'

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
const showDialog = ref(false)

//  DOM 引用 
const userinfoContainer = ref(null)
const bg = ref(null)
const nav = ref(null)

//  拖拽/滚动相关状态 
const DifY = ref(0)
const StartY = ref(0)
const moveY = ref(150)
const down = ref(false)
const speed = ref(0) // 速度
const Time = ref(0) // 时间

const updataY = (DifY) => {
    requestAnimationFrame(() => {
        if (DifY > 150) bg.value.style.height = `${DifY}px`
        userinfoContainer.value.style.transform = `translateY(${DifY}px)`
    })
}
const maxtransform = () => {
    const { height } = userinfoContainer.value.getBoundingClientRect()
    const max = height - window.innerHeight
    return max > 0 ? -max : max
}
const tstart = (e) => {
    down.value = true
    StartY.value = e.touches[0].pageY
    userinfoContainer.value.addEventListener('touchmove', tmove, { passive: false })
    moveY.value = parseFloat(window.getComputedStyle(userinfoContainer.value).transform.split(',')[5])
    updataY(moveY.value)
}

const tmove = (e) => {
    const currentPageY = e.touches[0].pageY
    const max = maxtransform()

    const { height } = userinfoContainer.value.getBoundingClientRect()
    const time = Date.now()
    const movey = height - window.innerHeight > 0 ? Math.max(moveY.value + currentPageY - StartY.value, max) : 150
    speed.value = (movey - DifY.value) / (time - Time.value)

    updataY(movey)
    DifY.value = movey
    Time.value = time
    if (DifY.value > 350) tend()
}

const tend = (e) => {
    down.value = false
    moveY.value = DifY.value
    const offsetY = speed.value * 500
    const max = maxtransform()
    const Finalposition = Math.min((Math.max(offsetY + DifY.value, max)), 150)
    updataY(Finalposition)
    if (moveY.value > 150) {
        moveY.value = 150
        requestAnimationFrame(() => {
            userinfoContainer.value.style.transform = `translateY(150px)`
            bg.value.style.height = `150px`
        })
        userinfoContainer.value.removeEventListener('touchmove', tmove)
    }
}

const toUpdateUserInfo = () => {
    router.push({ name: 'UpdateUserInfo' })
}

const Logout = () => {
    logout()
    router.push({ path: '/home' })
    window.location.reload()
}

const count = ref(0)
let removeAfter = null
removeAfter = router.afterEach(() => {
    count.value++
})
onMounted(() => {
    userinfoContainer.value.addEventListener('touchstart', tstart)
    userinfoContainer.value.addEventListener('touchend', tend)
})

onUnmounted(() => {
    if (removeAfter) removeAfter()
})

onActivated(async () => {
    count.value = 1
    userInfo.value = userinfo
    const id = route.params.id === 'me' ? userinfo.userId : route.params.id
    if (id !== userinfo.userId) userInfo.value = await getUserInfo(id, userinfo.userId)

    Followersnum.value = await FollowersNum(id)
    Fansnum.value = await FansNum(id)
    Likesnum.value = await LikesNum(id)
    byLikesnum.value = await byLikesNum(id)
    Videosnum.value = await VideosNum(id)
})
</script>
<template>
    <Dialog :show="showDialog" :options="{ title: '是否保存修改' }" @close="showDialog = false" @confirm="Logout" />
    <div class="r" v-if="route.params.id == 'me'" @click="showMenu = !showMenu">...
        <transition name="fade">
            <ul class="more-menu" v-if="showMenu">
                <li @click="toUpdateUserInfo">修改个人资料</li>
                <li @click="showDialog = true">注销</li>
            </ul>
        </transition>
    </div>
    <div class="l iconfont icon-zuojiantou" v-else @click="router.go(-count)"></div>

    <img src="/src/assets/bg.jpg"
        :style="{ 'transition': down ? 'none' : 'all .7s cubic-bezier(0.165, 0.84, 0.44, 1)' }" class="bg" ref="bg">
    <div class="userinfo-container" ref="userinfoContainer"
        :style="{ 'transition': down ? 'none' : 'all .7s cubic-bezier(0.165, 0.84, 0.44, 1)' }"
        :class="{ 'pb': route.params.id === 'me' }">
        <div class="userinfo" ref="userinfoContainer">
            <Followbtn v-if="route.params.id !== 'me'" class="Followbtn" :item="userInfo" :myUserId="userinfo.userId">
            </Followbtn>
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
        <nav ref="nav" :data-name="userInfo.userNickname">
            <router-link :to="`/user/${route.params.id}/videos`">作品{{ Videosnum }}</router-link>
            <router-link :to="`/user/${route.params.id}/videoAndDesc`">动态{{ Videosnum }}</router-link>
            <router-link :to="`/user/${route.params.id}/likes`">喜欢{{ Likesnum }}</router-link>
        </nav>
        <router-view v-slot="{ Component }">
            <keep-alive max="10">
                <component :is="Component" :key="route.fullPath" />
            </keep-alive>
        </router-view>
    </div>
</template>
<style lang="scss" scoped>
@mixin lr-btn {
    position: fixed;
    top: 10px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    width: 28px;
    height: 28px;
    background: rgba(22, 24, 35, 0.6);
    z-index: 3;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    z-index: -1;
    transform: translateY(100px);
}

.r {
    right: 10px;
    @include lr-btn;

    .more-menu {
        position: absolute;
        top: 45px;
        right: 0px;
        width: 80px;
        background: rgba(22, 24, 35, 0.6);

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
}

.l {
    font-size: 10px;
    line-height: 28px;
    left: 10px;
    @include lr-btn;
}

.userinfo-container {
    width: 100%;
    transform: translateY(150px);

    &.pb {
        padding-bottom: 50px;
    }

    &.noShow {
        position: relative;
        z-index: 2;
    }


    nav {
        display: flex;
        // position: sticky;
        // top: 44px;
        // left: 0;
        z-index: 2;

        &.is-stuck {
            &::after {
                content: attr(data-name);
                position: absolute;
                top: -44px;
                left: 0;
                width: 100%;
                height: 44px;
                line-height: 44px;
                text-align: center;
                color: #fff;
                background-color: $backcolor;
            }
        }

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
        color: #fff;
        padding: 0 10px;
        position: relative;
        background-color: $backcolor;

        .Followbtn {
            position: absolute;
            right: 10px;
            top: 10px;
        }

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