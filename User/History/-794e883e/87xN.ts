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
      path: '/public-platform',
      name: 'publiclatform',
      component: layout
    }
  ]
}
export default publicPlatform
