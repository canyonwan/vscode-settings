import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { PartitionOutlined } from '@vicons/antd'
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
    path: '/type',
    name: 'type',
    redirect: '/type/target-type',
    component: Layout,
    meta: {
      title: '基本类型',
      icon: renderIcon(PartitionOutlined),
      sort: 4,
      permissions: ['b04']
    },
    children: [
      {
        path: 'target-type',
        name: 'type-target-type',
        meta: {
          title: '检查对象类型',
          permissions: ['b04_01']
        },
        component: () => import('@/views/basic-type/target-type/index.vue')
      },
      {
        path: 'depart-type',
        name: 'type-depart-types',
        meta: {
          title: '部门类型',
          permissions: ['b04_02']
        },
        component: () => import('@/views/basic-type/depart-type/index.vue')
      },
      {
        path: 'cause-types',
        name: 'type-cause-types',
        meta: {
          title: '违法行为类型',
          permissions: ['b04_03']
        },
        component: () => import('@/views/setting/base-type/index.vue')
      },
      {
        path: 'case-types',
        name: 'type-case-types',
        meta: {
          title: '案件类型',
          permissions: ['b04_04']
        },
        component: () => import('@/views/setting/case-type/index.vue')
      }
    ]
  }
]

export default routes
