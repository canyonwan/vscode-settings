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
      sort: 9,
      permissions: ['b09']
    },
    children: [
      {
        path: 'app-package-manage',
        name: 'setting-app-package-manage',
        meta: {
          title: '安装包维护'
        },
        component: () => import('@/views/setting/app-package-manage/index.vue')
      },
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
          title: '自定义表单列表',
          permissions: ['b09_01']
        },
        component: () => import('@/views/setting/custom-form/form-list.vue')
      },
      {
        path: 'dictionaries',
        name: 'setting-dictionaries',
        meta: {
          title: '字典',
          permissions: ['b09_02']
        },
        component: () => import('@/views/setting/dictionary/index.vue')
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
