import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/index/index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/index/home.vue'),
        },
        {
          path: '/concern',
          name: 'concern',
          component: () => import('@/views/index/concern.vue')
        },
        {
          path: '/message',
          name: 'message',
          component: () => import('@/views/index/message.vue')
        },
        {
          path: '/user/:id?',
          name: 'user',
          redirect: to => {
            if (to.params.id) {
              return `/user/${to.params.id}/videos`;
            } else {
              return '/user/me/videos';
            }
          },
          component: () => import('@/views/index/user.vue'),
          children: [
            {
              path: '/user/:id?/videos',
              name: 'Video',
              component: () => import('@/views/User/VideosNum.vue')
            },
            {
              path: '/user/:id?/videoAndDesc',
              name: 'VideoAndDesc',
              component: () => import('@/views/User/VideosAndDesc.vue')
            },
            {
              path: '/user/:id?/like',
              name: 'Like',
              component: () => import('@/views/User/LikesNum.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('@/views/index/updates.vue')
    }
  ],
})

export default router