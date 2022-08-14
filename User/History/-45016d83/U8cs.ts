import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
// import { TableOutlined } from '@vicons/antd'
import { UserMultiple } from '@vicons/carbon'
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
const routeName = 'dashboard'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: routeName,
    redirect: '/test/test-list',
    component: Layout,
    meta: {
      title: '测试路由',
      icon: renderIcon(UserMultiple),
      sort: 3
    },
    children: [
      {
        path: 'test-list',
        name: 'TestList',
        meta: {
          title: '测试列表'
        },
        component: () => import('@/views/test/index.vue')
      }
    ]
  }
]

export default routes
