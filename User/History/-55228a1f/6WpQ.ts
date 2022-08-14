import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { ProjectOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'
// 执法台帐
const routes: Array<RouteRecordRaw> = [
  {
    path: '/law-enforcement-account',
    name: 'LawEnforcementAccount',
    component: Layout,
    meta: {
      title: '执法台帐',
      sort: 11,
      icon: renderIcon(ProjectOutlined)
    },
    children: [
      {
        path: '/law-enforcement-account',
        name: 'LawEnforcementAccountHome',
        meta: {
          title: '执法台帐'
        },
        component: () => import('@/views/law-enforcement-account/index.vue')
      },
      {
        path: '/case-detail/:programId?',
        name: 'CaseDetail',
        meta: {
          title: '查看详情',
          hidden: true,
          activeMenu: '/law-enforcement-account'
        },
        component: () => import('@/views/law-enforcement-account/components/case-detail.vue')
      },
      {
        path: 'discretion',
        name: 'Discretion',
        meta: {
          title: '裁量'
        },
        component: () => import('@/views/law-enforcement-account/discretion/index.vue')
      }
    ]
  }
]

export default routes
