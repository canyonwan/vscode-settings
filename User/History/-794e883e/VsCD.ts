import { RouteRecordRaw } from 'vue-router'
import layout from '@/views/layout/index.vue'
/** 法律法规 */
const publicPlatform: RouteRecordRaw = {
  path: '/public-platform',
  name: 'public-platform',
  component: layout,
  meta: {
    title: '公示公开',
    icon: 'law'
  },
  children: [
    {
      path: 'public',
      name: 'public',
      meta: {
        title: '公共法律法规',
        moduleCode: 'PublicLawsAndRegulations'
      },
      component: () => import('@/views/home/index.vue')
    }
  ]
}
export default publicPlatform
