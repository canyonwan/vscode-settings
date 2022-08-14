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
      },
      {
        // path: 'detail/:programId?',
        path: 'detail',
        name: 'ProgramDetail',
        meta: {
          title: '记录轴详情',
          keepAlive: true,
          hidden: true,
          activeMenu: 'program'
        },
        // component: () => import('@/views/program/components/case-detail.vue'),
        component: () => import('@/views/program/components/vertical-case-detail/v-case-detail.vue')
      },
      {
        path: 'document-mark',
        name: 'program-document-mark',
        meta: {
          title: '文书制作',
          hidden: true,
          activeMenu: 'program'
        },
        component: () => import('@/views/program/document-mark/index.vue')
      }
    ]
  }
]

export default routes
