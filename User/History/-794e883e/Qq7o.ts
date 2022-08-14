import { RouteRecordRaw } from 'vue-router'
import layout from '@/views/layout/index.vue'
/** 公示公开 */
const publicPlatform: RouteRecordRaw = {
  path: '/public-platform',
  name: 'publiclatform',
  meta: {
    title: '公示公开',
    icon: 'law'
  }
}
export default publicPlatform
