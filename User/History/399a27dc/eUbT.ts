import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { BookOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils'

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/cause',
    name: 'cause',
    redirect: '/cause/behaviour',
    component: Layout,
    meta: {
      title: '违法行为库',
      icon: renderIcon(BookOutlined),
      sort: 1,
      permissions: ['b01']
    },
    children: [
      {
        path: 'evidence-menu',
        name: 'cause-evidence-menu',
        meta: {
          title: '证据清单',
          permissions: ['b01_03'],
          sort: 1
        },
        component: () => import('@/views/cause-library/evidence/menu/index')
      },
      {
        path: 'evidence',
        name: 'cause-evidence',
        meta: {
          title: '证据分组',
          permissions: ['b01_02'],
          sort: 2
        },
        component: () => import('@/views/cause-library/evidence/group/index')
      },
      {
        path: 'discretion-menu',
        name: 'cause-discretion-menu',
        meta: {
          title: '裁量清单',
          permissions: ['b01_04'],
          sort: 3
        },
        component: () => import('@/views/cause-library/discretion/menu/home.vue')
      },
      {
        path: 'discretion-type',
        name: 'cause-discretion-type',
        meta: {
          title: '裁量类型',
          permissions: ['b01_05'],
          sort: 4
        },
        component: () => import('@/views/cause-library/discretion/type/home.vue')
      },
      {
        path: 'discretion-group',
        name: 'cause-discretion-group',
        meta: {
          title: '裁量分组',
          permissions: ['b01_06'],
          sort: 5
        },
        component: () => import('@/views/cause-library/discretion/group/index')
      },
      {
        path: 'manage',
        name: 'cause-manage',
        meta: {
          title: '违法行为',
          permissions: ['b01_01'],
          sort: 6
        },
        component: () => import('@/views/cause-library/manage/index.vue')
      }
    ]
  }
]

export default routes
