import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { ProjectOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'
// 案由浏览
const routes: Array<RouteRecordRaw> = [
  {
    path: '/cause-browse',
    name: 'CauseBrowse',
    redirect: '/cause-browse',
    component: Layout,
    meta: {
      title: '案由浏览',
      sort: 13,
      alwaysNoShow: true,
      icon: renderIcon(ProjectOutlined),
      permissions: ['a02']
    },
    children: [
      {
        path: 'home',
        name: 'ProgramHome',
        meta: {
          title: '执法台帐',
          keepAlive: true
        },
        props: true,
        component: () => import('@/views/program/index.vue')
      }
    ]
  }
]

export default routes
