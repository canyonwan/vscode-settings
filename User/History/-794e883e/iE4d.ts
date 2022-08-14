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
  }
}
export default publicPlatform
