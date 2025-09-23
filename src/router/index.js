import { createRouter, createWebHistory } from 'vue-router'
import { loginStore } from '@/stores/counter'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          meta: { keepAlive: true },
          component: () => import('@/views/Home/index.vue'),
        },
        {
          path: '/concern',
          name: 'concern',
          component: () => import('@/views/Concern/index.vue')
        },
        {
          path: '/message',
          name: 'message',
          component: () => import('@/views/Message/index.vue')
        },
        {
          path: '/user/:id?',
          name: 'user',
          redirect: from => {
            if (from.params.id) {
              return `/user/${from.params.id}/videos`;
            } else {
              return '/user/me/videos';
            }
          },
          component: () => import('@/views/User/index.vue'),
          children: [
            {
              path: 'videos',
              name: 'Video',
              component: () => import('@/views/User/VideosNum.vue')
            },
            {
              path: 'videoAndDesc',
              name: 'VideoAndDesc',
              component: () => import('@/views/User/VideosAndDesc.vue')
            },
            {
              path: 'likes',
              name: 'Likes',
              component: () => import('@/views/User/LikesNum.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('@/views/Updates/index.vue')
    },
    {
      path: '/fan',
      name: 'Fan',
      component: () => import('@/views/Message/fan.vue')
    },
    {
      path: '/like',
      name: 'Like',
      component: () => import('@/views/Message/like.vue')
    },
    {
      path: '/at',
      name: 'At',
      component: () => import('@/views/Message/at.vue')
    },
    {
      path: '/comment',
      name: 'Comment',
      component: () => import('@/views/Message/comment.vue')
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/views/Message/contact.vue')
    },
    {
      path: '/chatWith',
      name: 'ChatWith',
      component: () => import('@/views/Message/ChatWith.vue')
    },
    {
      path: '/UpdateUserInfo',
      name: 'UpdateUserInfo',
      component: () => import('@/views/User/UpdateUserInfo.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/Home/search.vue')
    }
  ],
})
// // 白名单
const whiteList = ['/home']
router.beforeEach((to, from, next) => {
  const LoginStore = loginStore()
  if (localStorage.getItem('tiktok_userinfo')) {
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/home')
      LoginStore.loginShow = true
    }
  }
})
export default router