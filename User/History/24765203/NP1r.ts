import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { ReadOutlined } from '@vicons/antd'
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
    path: '/law',
    name: 'law',
    redirect: '/law/type',
    component: Layout,
    meta: {
      title: '法律法规',
      icon: renderIcon(ReadOutlined),
      sort: 8,
      permissions: ['b08']
    },
    children: [
      {
        path: 'type',
        name: 'law-type',
        meta: {
          title: '法类型/法标签',
          permissions: ['b08_01']
        },
        component: () => import('@/views/law/law-type/index.vue')
      },
      {
        path: 'cause',
        name: 'law-cause',
        meta: {
          title: '违法行为法律',
          permissions: ['b08_02']
        },
        component: () => import('@/views/law/law-cause/index.vue')
      }
    ]
  }
]

export default routes
