import { RouteRecordRaw } from 'vue-router'
import layout from '@/views/layout/index.vue'
/** 公示公开 */
const publicPlatform: RouteRecordRaw = {
  path: '/public-platform',
  name: 'publicPlatform',
  component: () => import('@/pages/index/App.vue'),
  meta: {
    title: '公示公开',
    icon: 'law'
  }
}
export default publicPlatform
