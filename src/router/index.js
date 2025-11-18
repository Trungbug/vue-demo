/**
 * Router configuration cho ứng dụng
 * Created By NMDUC - 18/11/2025
 */
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
      // lazy-loaded route component
      component: () => import('@/views/WorkShift/WorkShift.vue'),
    },
  ],
})

export default router
