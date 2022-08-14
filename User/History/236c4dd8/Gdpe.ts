import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { ContainerRegistry } from '@vicons/carbon'
import { renderIcon } from '@/utils/index'

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
    path: '/base',
    name: 'Base',
    redirect: '/base/banner-list',
    component: Layout,
    meta: {
      title: '基础维护',
      icon: renderIcon(ContainerRegistry),
      sort: 1
    },
    children: [
      {
        path: 'banner-list',
        name: 'banner-list',
        meta: {
          title: '轮播图'
        },
        component: () => import('@/views/base/banner.vue')
      },
      {
        path: 'announcement-list',
        name: 'announcement-list',
        meta: {
          title: '公告'
        },
        component: () => import('@/views/base/announcement.vue')
      },
      {
        path: 'ad-list',
        name: 'ad-list',
        meta: {
          title: '广告位'
        },
        component: () => import('@/views/base/ad.vue')
      }
    ]
  }
]

export default routes
