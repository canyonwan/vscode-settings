import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { ProjectOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'
// 案由浏览
const routes: Array<RouteRecordRaw> = [
  {
    path: '/program',
    name: 'program',
    redirect: '/program',
    component: Layout,
    meta: {
      title: '执法台帐',
      sort: 12,
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
