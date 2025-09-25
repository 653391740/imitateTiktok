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
          component: () => import('@/views/index/home.vue')
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
          component: () => import('@/views/index/user.vue')
        }
      ]
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('@/views/index/updates.vue')
    },
    {
      path: '/qqq',
      component: () =>import('@/views/qqq.vue')
    }
  ],
})

export default router
