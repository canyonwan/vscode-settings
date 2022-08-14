import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { SettingOutlined } from '@vicons/antd'
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
    path: '/setting',
    name: 'setting',
    redirect: '/setting/custom-form-list',
    component: Layout,
    meta: {
      title: '系统设置',
      icon: renderIcon(SettingOutlined),
      sort: 5
    },
    children: [
      {
        path: 'custom-form/:fromId*',
        name: 'setting-custom-form',
        meta: {
          title: '自定义表单',
          hidden: true,
          activeMenu: 'setting-custom-form-list'
        },
        component: () => import('@/views/setting/custom-form/index.vue')
      },
      {
        path: 'custom-form-list',
        name: 'setting-custom-form-list',
        meta: {
          title: '自定义表单列表'
        },
        component: () => import('@/views/setting/custom-form/form-list.vue')
      },
      {
        path: 'dictionaries',
        name: 'setting-dictionaries',
        meta: {
          title: '字典'
        },
        component: () => import('@/views/setting/dictionary/index.vue')
      },
      {
        path: 'base-types',
        name: 'setting-base-types',
        meta: {
          title: '基本类型'
        },
        component: () => import('@/views/setting/base-type/index.vue')
      },
      {
        path: 'case-types',
        name: 'setting-case-types',
        meta: {
          title: '案件类型'
        },
        component: () => import('@/views/setting/case-type/index.vue')
      },
      {
        path: 'test-path',
        name: 'setting-test-path',
        meta: {
          title: '测试'
        },
        component: () => import('@/views/setting/test/index2.vue')
      }
    ]
  }
]

export default routes
