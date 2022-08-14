import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import layout from '@/views/publicity-platform/layout/index.vue'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { hasKey } from '@/utils'
// import { isHaveModule } from '@/utils/handle'
/***
 *  meta中 hidden 判断显示不显示菜单  isShowNavigation 是否显示导航
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'h',
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
        name: 'before',
        meta: {
          title: '事前公开'
        },
        component: () => import('@/views/home/dash-board.vue')
      },
      {
        path: 'after',
        name: 'after',
        meta: {
          title: '事后公开'
        },
        component: () => import('@/views/home/dash-board.vue')
      }
    ]
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
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to: any, from: any, next: any) => {
  // window.location.href = 'upgrade.html'
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!hasKey(store.getters.userInfo)) {
        store.dispatch('app/getUserInfo').then(() => {
          next({ ...to, replace: true })
          // else if (store.getters.userInfo.menuDetailOutputs.length > 0) {
          //   let copyRouter: Array<RouteRecordRaw> = [...routerList]
          //   copyRouter = copyRouter.filter((item: any) => {
          //     if (item.meta && item.meta.moduleCode) {
          //       return isHaveModule(item.meta.moduleCode)
          //     } else {
          //       return item
          //     }
          //   })
          //   for (const c of copyRouter) {
          //     if (c.children && c.children.length > 0) {
          //       c.children.filter((item: any) => {
          //         if (item.meta && item.meta.moduleCode) {
          //           return isHaveModule(item.meta.moduleCode)
          //         } else return item
          //       })
          //     }
          //   }
          //   router.options.routes = router.options.routes.concat(copyRouter)
          //   copyRouter.forEach((item: any) => {
          //     router.addRoute(item)
          //   })
          //   next({ ...to, replace: true })
          // }
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
