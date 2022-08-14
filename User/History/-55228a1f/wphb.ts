import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { ProjectOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'
// 执法台帐
const routes: Array<RouteRecordRaw> = [
  {
    path: '/program',
    name: 'program',
    redirect: '/program',
    component: Layout,
    meta: {
      title: '执法台帐',
      sort: 11,
      icon: renderIcon(ProjectOutlined)
    },
    children: [
      {
        path: 'home',
        name: 'program-home',
        meta: {
          title: '执法台帐'
        },
        component: () => import('@/views/program/index.vue')
      },
      {
        path: 'discretion',
        name: 'program-discretion',
        meta: {
          title: '裁量'
        },
        component: () => import('@/views/program/discretion/index.vue')
      },
      {
        // path: 'detail/:programId?',
        path: 'detail',
        name: 'program-detail',
        meta: {
          title: '查看详情',
          hidden: true,
          activeMenu: 'program'
        },
        component: () => import('@/views/program/components/case-detail.vue'),
        children: []
      },
      {
        path: 'document-mark',
        name: 'program-document-mark',
        meta: {
          title: '文书制作',
          hidden: true,
          activeMenu: 'program'
        },
        component: () => import('@/views/program/document-mark/index.vue'),
        children: []
      }
    ]
  }
]

export default routes
