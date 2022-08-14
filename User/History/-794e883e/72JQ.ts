import { RouteRecordRaw } from 'vue-router'
import layout from '@/views/layout/index.vue'
/** 公示公开 */
const publicPlatform: RouteRecordRaw = {
  path: '/public-platform',
  name: 'publiclatform',
  component: layout,
  meta: {
    title: '公示公开',
    icon: 'supervise'
  },
  children: [
    {
      path: 'public-platform-before',
      name: 'publicPlatformBefore',
      meta: {
        title: '事前公开'
      },
      component: () => import('@/views/home/index.vue')
    },
    {
      path: 'public-platform-after',
      name: 'publicPlatformAfter',
      meta: {
        title: '事后公开'
      },
      component: () => import('@/views/home/index.vue')
    }
  ]
}
export default publicPlatform
