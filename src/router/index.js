import { createRouter, createWebHistory } from 'vue-router'
import WorkShift from '@/views/WorkShift/WorkShift.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WorkShift,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/WorkShift/WorkShift.vue'),
    },
  ],
})

export default router
