import Vue from 'vue'
import Router from 'vue-router'
import { getToken, removeToken } from '@/utils/auth'
import { hasKey } from '@/utils'
import store from '@/store'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/page-home/home/home-index.vue')
    },
    {
      path: '/login/:type',
      name: 'login',
      component: () => import('@/page-home/login/index.vue')
    },
    {
      path: '/personal', // 个人中心
      name: 'personal',
      component: () => import('@/page-home/personal/index.vue')
    },
    {
      path: '/account', // 账户信息
      name: 'account',
      component: () => import('@/page-home/account/index.vue')
    },
    // {
    //   path: '/message', // 消息中心
    //   name: 'message',
    //   component: () => import('@/page-home/message/index.vue')
    // },
    {
      path: '/risk-manage', // 风险管理
      name: 'riskManage',
      component: () => import('@/page-home/other-columns/risk-manage.vue')
    },
    {
      path: '/place-practice', // 地方实践
      name: 'placePractice',
      component: () => import('@/page-home/other-columns/place-practice.vue')
    },
    {
      path: '/experts-and-org', // 专家与机构
      name: 'expertsAndOrg',
      component: () => import('@/page-home/other-columns/experts-and-org.vue')
    },
    {
      path: '/data-center', // 数据中心
      name: 'dataCenter',
      component: () => import('@/page-home/data-center/index.vue')
    },
    {
      path: '/public-interaction', // 公众互动
      name: 'publicInteraction',
      component: () => import('@/page-home/other-columns/public-interaction.vue')
    },
    {
      path: '/no-power/:type',
      name: 'noPower',
      component: () => import('@/page-home/no-power/index.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
const loginList = [
  // 'placeSubmit',
  // 'claimSubmit',
  // 'query',
  // 'queryClaim',
  // 'accountInformation',
  'personal',
  'message'
]
router.beforeEach((to: any, from: any, next: any) => {
  LoadingBar.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!hasKey(store.getters.userInfo)) {
        store.dispatch('getInfo').then(() => {
          next()
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token 判断 跳转路由是否需要 token
    if (loginList.includes(to.name)) {
      next('/no-power/0')
    } else {
      next()
    }
  }
})
router.afterEach((to) => {
  LoadingBar.finish()
  // window.scroll(0, 0)
  window.scrollTo(0, 0)
})
export default router
