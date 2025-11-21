/**
 * Router configuration cho ứng dụng
 * Created By NMDUC - 18/11/2025
 */
import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/layout/TheLayout.vue'
import WorkShift from '@/views/WorkShift/WorkShift.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TheLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: WorkShift,
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Tổng quan' },
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Đơn đặt hàng' },
        },
        {
          path: 'production-plan',
          name: 'production-plan',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Kế hoạch sản xuất' },
        },
        {
          path: 'coordination',
          name: 'coordination',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Điều phối và thực thi' },
        },
        {
          path: 'quality-check',
          name: 'quality-check',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Kiểm tra chất lượng' },
        },
        {
          path: 'warehouse',
          name: 'warehouse',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Kho vật tư' },
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Báo cáo' },
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Sản phẩm, NVL' },
        },
        {
          path: 'production-process',
          name: 'production-process',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Quy trình sản xuất' },
        },
        {
          path: 'production-capacity',
          name: 'production-capacity',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Năng lực sản xuất' },
        },
        {
          path: 'others',
          name: 'others',
          component: WorkShift,
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/PlaceholderView.vue'),
          props: { title: 'Thiết lập' },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/WorkShift/WorkShift.vue'),
        },
      ],
    },
  ],
})

export default router
