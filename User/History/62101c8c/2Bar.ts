import type { AppRouteRecordRaw } from '@/router/types'
import { ErrorPage, RedirectName, Layout } from '@/router/constant'

// 404 on a page
export const ErrorPageRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: Layout,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true
      }
    }
  ]
}

export const RedirectRoute: AppRouteRecordRaw = {
  path: '/redirect',
  name: RedirectName,
  component: Layout,
  meta: {
    title: RedirectName,
    hideBreadcrumb: true
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: RedirectName,
      component: () => import('@/views/redirect/index.vue'),
      meta: {
        title: RedirectName,
        hideBreadcrumb: true
      }
    }
  ]
}

export const InformRoute: AppRouteRecordRaw = {
  path: '/inform',
  name: 'Inform',
  component: Layout,
  meta: {
    title: '通知'
  },
  children: [
    {
      path: '/inform',
      name: 'InformSon',
      component: import('@/views/user/personnel/index.vue'),
      meta: {
        title: '通知'
      }
    }
  ]
}
