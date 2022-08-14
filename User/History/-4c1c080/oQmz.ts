import { ISelectOption } from '@/components/main-header'

// 台帐类型
const typeOptions: ISelectOption[] = [
  {
    label: '行政检查',
    value: 1
  },
  {
    label: '行政处罚',
    value: 2
  },
  {
    label: '行政强制',
    value: 3
  },
  {
    label: '移交移送',
    value: 4
  }
]

// 动态组件列表
const compMap = new Map()
  .set(
    1,
    defineAsyncComponent(() => import('@v/'))
  )
  .set(
    2,
    defineAsyncComponent(() => import('./components/punish.vue'))
  )
  .set(
    3,
    defineAsyncComponent(() => import('./components/force.vue'))
  )
  .set(
    4,
    defineAsyncComponent(() => import('./components/hand-over.vue'))
  )

export { typeOptions, compMap }
