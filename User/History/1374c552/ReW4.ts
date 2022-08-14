import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import layout from '@/views/publicity-platform/layout/index.vue'
// import { isHaveModule } from '@/utils/handle'
/***
 *  meta中 hidden 判断显示不显示菜单  isShowNavigation 是否显示导航
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'publicity',
    component: layout,
    meta: {
      title: '执法主页',
      icon: 'home',
      showAlways: true,
      isShowNavigation: true
    },
    redirect: '/before',
    children: [
      {
        path: 'before',
        name: 'publicityBefore',
        meta: {
          title: '事前公开'
        },
        component: () => import('@/views/publicity-platform/before/index.vue')
      },
      {
        path: 'after',
        name: 'publicityAfter',
        meta: {
          title: '事后公开',
          keepAlive: true
        },
        component: () => import('@/views/publicity-platform/after/index.vue')
      },
      {
        path: 'detail',
        name: 'publicityDetail',
        meta: {
          title: '详情信息'
        },
        component: () => import('@/views/publicity-platform/components/details/index.vue')
      }
    ]
  },
  {
    path: '/imagesWall',
    name: 'publicityImagesWall',
    component: () => import('@/views/publicity-platform/components/images-wall.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/result/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to: any, from: any, next: any) => {
  next()
})
export default router
